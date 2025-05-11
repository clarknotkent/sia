//sia-backend/POS/posRoutes.js
const express = require('express');
const router = express.Router();
const {
  handleCheckout,
  handleGetHistory,
  handleDeleteTransaction, // Ensure this is imported
} = require('./posController'); 

// POST  /api/pos/checkout
router.post('/checkout', handleCheckout);

// GET   /api/pos/history
router.get('/history', handleGetHistory);

// DELETE /api/pos/history/:orderId
router.delete('/history/:orderId', handleDeleteTransaction);

module.exports = router;
