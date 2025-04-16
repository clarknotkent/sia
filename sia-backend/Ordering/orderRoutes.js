const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  placeOrder
} = require('./orderController');

router.get('/', getAllOrders);
router.post('/', placeOrder);

module.exports = router;
