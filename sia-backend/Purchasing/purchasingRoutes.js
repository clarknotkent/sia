const express = require('express');
const router = express.Router();
const {
  getAllPurchases,
  addPurchase
} = require('./purchasingController');

router.get('/', getAllPurchases);
router.post('/', addPurchase);

module.exports = router;
