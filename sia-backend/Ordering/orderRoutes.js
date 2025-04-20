//sia-backend/Ordering/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllClients, addClient, updateClient, deleteClient,
  getAllQuotations, addQuotation, updateQuotation, deleteQuotation,
  getAllOrders, getOrderById, convertQuotationToOrder, updateOrder, deleteOrder,
  markOrderAsDelivered
} = require("./orderController");

// Clients
router.get("/clients", getAllClients);
router.post("/clients", addClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

// Quotations
router.get("/quotations", getAllQuotations);
router.post("/quotations", addQuotation);
router.put("/quotations/:id", updateQuotation);
router.delete("/quotations/:id", deleteQuotation);
router.post("/quotations/:id/convert", convertQuotationToOrder);

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);
router.put("/orders/:id/mark-delivered", markOrderAsDelivered);

module.exports = router;
