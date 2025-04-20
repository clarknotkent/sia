//sia-backend/Delivery/deliveryController.js
const { orderList } = require("../Ordering/orderController"); // Import order list

// Mock in-memory delivery storage
const deliveries = [];

// Create a new delivery
const createDelivery = (req, res) => {
  console.log("POST /api/delivery payload:", req.body);
  const { orderID, customer, address, driver, date } = req.body;

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
    status: "Pending"
  };

  deliveries.push(newDelivery);
  res.status(201).json(newDelivery);
};

// Get all deliveries
const getAllDeliveries = (req, res) => {
  res.json(deliveries);
};

// Get a specific delivery by ID
const getDeliveryById = (req, res) => {
  const delivery = deliveries.find(d => d.deliveryID === req.params.id);
  if (!delivery) return res.status(404).json({ error: "Delivery not found" });
  res.json(delivery);
};

// Update a delivery
const updateDelivery = (req, res) => {
  const idx = deliveries.findIndex(d => d.deliveryID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Delivery not found" });

  deliveries[idx] = { ...deliveries[idx], ...req.body };
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
