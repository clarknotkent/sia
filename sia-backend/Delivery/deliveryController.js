//sia-backend/Delivery/deliveryController.js
const { orderList } = require("../Ordering/orderController");
const { clientList } = require("../Ordering/orderController"); // Make sure clientList is exported

// Mock in-memory delivery storage
const deliveries = [];

// Create a new delivery
const createDelivery = (req, res) => {
  const { orderID, customer, address, driver, date } = req.body;

  // Prevent duplicate deliveries for the same orderID
  const existingDelivery = deliveries.find(d => d.orderID === orderID);
  if (existingDelivery) {
    return res.status(400).json({ error: "A delivery for this order already exists." });
  }

  // Find the corresponding order
  const order = orderList.find(o => o.orderID === orderID);
  if (!order) return res.status(404).json({ error: "Order not found" });

  // Ensure order is marked as ready for delivery
  if (order.deliveryStatus !== "Sent") {
    return res.status(400).json({ error: "Order not yet marked as ready for delivery." });
  }

  // Create the new delivery
  const newDelivery = {
    deliveryID: `DEL-${Date.now()}`,
    orderID,
    customer,
    address,
    driver: driver || "",
    date,
    status: "Pending",
    items: order.items ? [...order.items] : [], // <-- store a copy of items
  };

  deliveries.push(newDelivery);
  res.status(201).json(newDelivery);
};

// Get all deliveries
const getAllDeliveries = (req, res) => {
  const enriched = deliveries.map(delivery => {
    const order = orderList.find(o => o.orderID === delivery.orderID);
    const client = order?.client || clientList.find(c => c.name === delivery.customer);
    return {
      ...delivery,
      client,
      items: order?.items || delivery.items || [], // <-- FIX: fallback to delivery.items
    };
  });
  res.json(enriched);
};

// Get a specific delivery by ID
const getDeliveryById = (req, res) => {
  const delivery = deliveries.find(d => d.deliveryID === req.params.id);
  if (!delivery) return res.status(404).json({ error: "Delivery not found" });

  const order = orderList.find(o => o.orderID === delivery.orderID);
  const client = order?.client || clientList.find(c => c.name === delivery.customer);

  res.json({
    ...delivery,
    client,
    items: order?.items || delivery.items || [], // <-- FIX: fallback to delivery.items
  });
};

// Update a delivery
const updateDelivery = (req, res) => {
  const idx = deliveries.findIndex(d => d.deliveryID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Delivery not found" });

  deliveries[idx] = { ...deliveries[idx], ...req.body };

  // Also update the order status if status is changed to Delivered
  if (req.body.status === "Delivered") {
    const order = orderList.find(o => o.orderID === deliveries[idx].orderID);
    if (order) order.status = "Delivered";
  }

  res.json(deliveries[idx]);
};

// Delete a delivery
const deleteDelivery = (req, res) => {
  const idx = deliveries.findIndex(d => d.deliveryID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Delivery not found" });

  deliveries.splice(idx, 1);
  res.status(204).send();
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery
};
