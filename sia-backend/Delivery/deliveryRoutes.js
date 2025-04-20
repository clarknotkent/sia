//sia-backend/Delivery/deliveryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery
} = require('./deliveryController');

// Routes
router.get('/', getAllDeliveries);
router.get('/:id', getDeliveryById);
router.post('/', createDelivery);
router.put('/:id', updateDelivery);
router.delete('/:id', deleteDelivery);

module.exports = router;
