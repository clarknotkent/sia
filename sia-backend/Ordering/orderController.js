// File: sia-backend/Ordering/orderController.js
const { productList } = require("../Inventory/inventoryController");

let clientList = [
  {
    clientID: "C001",
    name: "ABC Pharmacy",
    licenseNo: "FDA12345",
    address: "123 St, Davao City", // ✅ Added Address field
    contactPerson: "Jane Dela Cruz",
    contactNumber: "0917-123-4567",
    email: "abc@pharmacy.com"
  },
  {
    clientID: "C002",
    name: "XYZ Drugstore",
    licenseNo: "FDA67890",
    address: "4321 St, Davao City", // ✅ Added Address field
    contactPerson: "Mark Santos",
    contactNumber: "0918-456-7890",
    email: "xyz@drugstore.com"
  }
];

let quotationList = [];
let orderList = [];

// CLIENT CONTROLLERS
const getAllClients = (req, res) => res.json(clientList);
const addClient = (req, res) => {
  const existing = clientList.find(c => c.clientID === req.body.clientID);
  if (existing) {
    return res.status(400).json({ error: "Client ID already exists" });
  }
  clientList.push(req.body);
  res.status(201).json(req.body);
};
const updateClient = (req, res) => {
  const idx = clientList.findIndex(c => c.clientID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Client not found" });
  clientList[idx] = { ...clientList[idx], ...req.body };
  res.json(clientList[idx]);
};
const deleteClient = (req, res) => {
  clientList = clientList.filter(c => c.clientID !== req.params.id);
  res.status(204).send();
};

// QUOTATION CONTROLLERS
const getAllQuotations = (req, res) => res.json(quotationList);
const addQuotation = (req, res) => {
  const q = req.body;
  for (const it of q.items) {
    const prod = productList.find(p => p.genericName === it.name);
    if (!prod || prod.inventory.stockLevel - prod.inventory.reservedStock < it.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${it.name}` });
    }
    prod.inventory.reservedStock += it.quantity;
  }
  quotationList.push(q);
  res.status(201).json(q);
};
const updateQuotation = (req, res) => {
  const idx = quotationList.findIndex(q => q.quotationID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Quotation not found" });

  const old = quotationList[idx];
  const upd = req.body;

  old.items.forEach(it => {
    const prod = productList.find(p => p.genericName === it.name);
    if (prod) prod.inventory.reservedStock -= it.quantity;
  });

  for (const it of upd.items) {
    const prod = productList.find(p => p.genericName === it.name);
    if (!prod || prod.inventory.stockLevel - prod.inventory.reservedStock < it.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${it.name}` });
    }
    prod.inventory.reservedStock += it.quantity;
  }

  quotationList[idx] = { ...old, ...upd };
  res.json(quotationList[idx]);
};
const deleteQuotation = (req, res) => {
  const idx = quotationList.findIndex(q => q.quotationID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Quotation not found" });
  quotationList[idx].items.forEach(it => {
    const prod = productList.find(p => p.genericName === it.name);
    if (prod) prod.inventory.reservedStock -= it.quantity;
  });
  quotationList.splice(idx, 1);
  res.status(204).send();
};

// ORDER CONTROLLERS
const getAllOrders = (req, res) => res.json(orderList);
const getOrderById = (req, res) => {
  const ord = orderList.find(o => o.orderID === req.params.id);
  if (!ord) return res.status(404).json({ error: "Order not found" });
  res.json(ord);
};
const convertQuotationToOrder = (req, res) => {
  const quotationID = req.params.id;
  const quotation = quotationList.find(q => q.quotationID === quotationID);
  if (!quotation) return res.status(404).json({ error: "Quotation not found" });
  if (quotation.status.toLowerCase() !== 'approved') return res.status(400).json({ error: "Only approved quotations can be converted" });

  const newOrder = {
    orderID: `ORDER-${Date.now()}`,
    orderDate: new Date().toISOString(),
    quotationID: quotation.quotationID,
    client: quotation.client,
    items: quotation.items,
    totalAmount: quotation.totalAmount,
    remainingBalance: 0,
    status: "Pending",
    deliveryStatus: "Not Sent"
  };

  quotation.status = "Converted";
  orderList.push(newOrder);
  quotation.items.forEach(it => {
    const prod = productList.find(p => p.genericName === it.name);
    if (prod) {
      prod.inventory.reservedStock -= it.quantity;
      prod.inventory.stockLevel -= it.quantity;
    }
  });

  res.status(201).json(newOrder);
};
const updateOrder = (req, res) => {
  const idx = orderList.findIndex(o => o.orderID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });

  const old = orderList[idx];
  const upd = req.body;

  old.items.forEach(it => {
    const prod = productList.find(p => p.genericName === it.name);
    if (prod) prod.inventory.stockLevel += it.quantity;
  });

  for (const it of upd.items) {
    const prod = productList.find(p => p.genericName === it.name);
    if (!prod || prod.inventory.stockLevel < it.quantity) {
      return res.status(400).json({ error: `Not enough stock for ${it.name}` });
    }
    prod.inventory.stockLevel -= it.quantity;
  }

  orderList[idx] = { ...old, ...upd };
  res.json(orderList[idx]);
};
const deleteOrder = (req, res) => {
  const idx = orderList.findIndex(o => o.orderID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });

  orderList[idx].items.forEach(it => {
    const prod = productList.find(p => p.genericName === it.name);
    if (prod) prod.inventory.stockLevel += it.quantity;
  });

  orderList.splice(idx, 1);
  res.status(204).send();
};

// New controller function to mark an order as delivered
const markOrderAsDelivered = (req, res) => {
  const { id } = req.params;
  const order = orderList.find(o => o.orderID === id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (order.deliveryStatus === 'Sent') {
    return res.status(400).json({ error: "Order already marked as delivered" });
  }

  order.deliveryStatus = 'Sent';
  res.json({ message: 'Delivery status updated', order });
};

module.exports = {
  getAllClients, addClient, updateClient, deleteClient,
  getAllQuotations, addQuotation, updateQuotation, deleteQuotation,
  getAllOrders, getOrderById, convertQuotationToOrder, updateOrder, deleteOrder,
  markOrderAsDelivered,
  orderList
};

