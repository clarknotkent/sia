// controllers/posController.js
const path = require('path');
const fs = require('fs');

let transactionHistory = []; // You can later persist this in a real DB
const { productList } = require('../Inventory/inventoryController');

// ✅ Handle POS Checkout
const handleCheckout = (req, res) => {
  const { cartItems, paymentMethod } = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty or invalid.' });
  }

  const updatedProducts = [];

  for (const item of cartItems) {
    const index = productList.findIndex(
      (p) => p.genericName === item.genericName && p.brandName === item.brandName
    );

    if (index === -1) {
      return res.status(404).json({ error: `Product not found: ${item.genericName}` });
    }

    const product = productList[index];
    const newStock = product.inventory.stockLevel - item.quantity;

    if (newStock < 0) {
      return res.status(400).json({ error: `Insufficient stock for ${item.genericName}` });
    }

    productList[index].inventory.stockLevel = newStock;
    productList[index].inventory.lastDateUpdated = new Date().toISOString().split("T")[0];

    updatedProducts.push(productList[index]);
  }

  // ✅ Generate transaction record
  const transaction = {
    orderId: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    items: cartItems,
    paymentMethod,
    subtotal: cartItems.reduce(
      (total, item) => total + item.price * item.quantity * (1 - item.discount / 100),
      0
    ),
    tax: 0.12,
    totalAmount: cartItems.reduce(
      (total, item) => total + item.price * item.quantity * (1 - item.discount / 100),
      0
    ) * 1.12,
  };

  transactionHistory.push(transaction);

  res.status(201).json({
    message: 'Checkout successful.',
    transaction,
    updatedProducts,
  });
};

module.exports = {
  handleCheckout,
};
