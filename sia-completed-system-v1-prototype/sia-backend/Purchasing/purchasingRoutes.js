// sia-backend/Purchasing/purchasingRoutes.js
const express = require('express');
const router = express.Router();
const {
  // Suppliers
  getAllSuppliers, addSupplier, updateSupplier, deleteSupplier,
  // Purchase Orders
  getAllPurchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
  // Receiving Logs
  getAllReceivingLogs, addReceivingLog, deleteReceivingLog, updateReceivingLog, sendToInventory
} = require('./purchasingController');

// Suppliers CRUD
router.get('/suppliers', getAllSuppliers);
router.post('/suppliers', addSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

// Purchase Orders
router.get('/purchaseOrders', getAllPurchaseOrders);
router.post('/purchaseOrders', addPurchaseOrder);
router.put('/purchaseOrders/:id', updatePurchaseOrder);
router.delete('/purchaseOrders/:id', deletePurchaseOrder);

// Receiving Logs
router.get('/receivingLogs', getAllReceivingLogs);
router.post('/receivingLogs', addReceivingLog);
router.delete('/receivingLogs/:id', deleteReceivingLog);
router.put('/receivingLogs/:id', updateReceivingLog);
router.post('/receivingLogs/:id/send-to-inventory', sendToInventory);

module.exports = router;
