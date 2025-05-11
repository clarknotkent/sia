// sia-backend/Purchasing/purchasingController.js
const axios = require('axios');
const INVENTORY_API_URL = process.env.INVENTORY_API_URL || 'http://localhost:5000/api/inventory';

//
// In‐memory stores (replace with DB later)
//
let suppliers = [
  {
    supplierID: "S001",
    name: "ABC Pharma Supply",
    contactPerson: "Jane Dela Cruz",
    contactNumber: "0917-123-4567"
  },
  {
    supplierID: "S002",
    name: "XYZ Medical Distributors",
    contactPerson: "Mark Santos",
    contactNumber: "0918-456-7890"
  },
  {
    supplierID: "S003",
    name: "MediHealth Traders",
    contactPerson: "Ana Reyes",
    contactNumber: "0919-234-5678"
  }
];
let purchaseOrders = [];  
let receivingLogs  = [];

//
//  SUPPLIERS CONTROLLERS
//

// GET /api/purchasing/suppliers
const getAllSuppliers = (req, res) => {
  res.json(suppliers);
};

// POST /api/purchasing/suppliers
const addSupplier = (req, res) => {
  const { supplierID } = req.body;
  if (suppliers.find(s => s.supplierID === supplierID)) {
    return res.status(400).json({ error: "Supplier ID already exists" });
  }
  suppliers.push(req.body);
  res.status(201).json(req.body);
};

// PUT /api/purchasing/suppliers/:id
const updateSupplier = (req, res) => {
  const idx = suppliers.findIndex(s => s.supplierID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Supplier not found" });
  suppliers[idx] = { ...suppliers[idx], ...req.body };
  res.json(suppliers[idx]);
};

// DELETE /api/purchasing/suppliers/:id
const deleteSupplier = (req, res) => {
  suppliers = suppliers.filter(s => s.supplierID !== req.params.id);
  res.status(204).send();
};

//
//  PURCHASE ORDERS CONTROLLERS
//

// GET /api/purchasing/purchaseOrders
const getAllPurchaseOrders = (req, res) => {
  res.json(purchaseOrders);
};

// POST /api/purchasing/purchaseOrders
const addPurchaseOrder = (req, res) => {
  const { poID, supplierID, orderDate, status = 'Pending', items = [] } = req.body;
  if (!poID || !supplierID || !orderDate || !items.length) {
    return res.status(400).json({ error: "Missing required purchase order fields." });
  }
  const newOrder = { poID, supplierID, status, orderDate, items };
  purchaseOrders.push(newOrder);
  res.status(201).json(newOrder);
};

// PUT /api/purchasing/purchaseOrders/:id
const updatePurchaseOrder = (req, res) => {
  const idx = purchaseOrders.findIndex(po => po.poID === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Purchase order not found" });
  }
  purchaseOrders[idx] = { ...purchaseOrders[idx], ...req.body };
  res.json(purchaseOrders[idx]);
};

// DELETE /api/purchasing/purchaseOrders/:id
const deletePurchaseOrder = (req, res) => {
  const before = purchaseOrders.length;
  purchaseOrders = purchaseOrders.filter(po => po.poID !== req.params.id);
  if (purchaseOrders.length === before) {
    return res.status(404).json({ error: "Purchase order not found" });
  }
  res.status(204).send();
};

//
//  RECEIVING LOGS CONTROLLERS
//

const getAllReceivingLogs = (req, res) => {
  res.json(receivingLogs);
};

// Only save the log, do NOT update inventory here
const addReceivingLog = (req, res) => {
  const { logID, poID, supplierName, dateReceived, items = [] } = req.body;
  if (!logID || !poID || !dateReceived || !items.length) {
    return res.status(400).json({ error: "Missing required receiving-log fields." });
  }
  // Optionally, set status to 'Pending' or from req.body
  const newLog = { logID, poID, supplierName, dateReceived, items, status: req.body.status || 'Pending' };
  receivingLogs.push(newLog);
  res.status(201).json(newLog);
};

// PUT /purchasing/receivingLogs/:id
const updateReceivingLog = (req, res) => {
  const idx = receivingLogs.findIndex(l => l.logID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Receiving log not found" });
  receivingLogs[idx] = { ...receivingLogs[idx], ...req.body };
  res.json(receivingLogs[idx]);
};

// POST /purchasing/receivingLogs/:id/send-to-inventory
const sendToInventory = async (req, res) => {
  const log = receivingLogs.find(l => l.logID === req.params.id);
  if (!log) return res.status(404).json({ error: "Receiving log not found" });

  for (const item of log.items) {
    try {
      const invRes = await axios.get(
        `${INVENTORY_API_URL}?genericName=${encodeURIComponent(item.name)}`
      );
      const prod = Array.isArray(invRes.data) ? invRes.data[0] : invRes.data;
      if (!prod || prod.id == null) {
        console.error(`No inventory record found for ${item.name}`);
        continue;
      }
      const newLevel = prod.inventory.stockLevel + item.quantity;
      await axios.put(
        `${INVENTORY_API_URL}/${prod.id}`,
        { inventory: { ...prod.inventory, stockLevel: newLevel } }
      );
    } catch (err) {
      console.error(`Failed to update inventory for ${item.name}:`, err.message);
    }
  }

  log.status = "Processed";
  res.json(log);
};

// DELETE /purchasing/receivingLogs/:id
const deleteReceivingLog = (req, res) => {
  const before = receivingLogs.length;
  receivingLogs = receivingLogs.filter(log => log.logID !== req.params.id);
  if (receivingLogs.length === before) {
    return res.status(404).json({ error: "Receiving log not found" });
  }
  res.status(204).send();
};

module.exports = {
  getAllSuppliers, addSupplier, updateSupplier, deleteSupplier,
  getAllPurchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
  getAllReceivingLogs, addReceivingLog, updateReceivingLog, sendToInventory, deleteReceivingLog,
};
