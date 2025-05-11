//sia-backend/POS/posController.js
const { productList } = require('../Inventory/inventoryController');

let transactionHistory = []; // In‑memory for now; swap to a DB later

// ✅ Handle POS Checkout
const handleCheckout = (req, res) => {
  const { cartItems, paymentMethod } = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty or invalid.' });
  }

  const updatedProducts = [];

  for (const item of cartItems) {
    const index = productList.findIndex(
      (p) =>
        p.genericName === item.genericName &&
        p.brandName === item.brandName
    );
    if (index === -1) {
      return res
        .status(404)
        .json({ error: `Product not found: ${item.genericName}` });
    }

    const product = productList[index];
    const newStock = product.inventory.stockLevel - item.quantity;
    if (newStock < 0) {
      return res
        .status(400)
        .json({ error: `Insufficient stock for ${item.genericName}` });
    }

    // update stock
    productList[index].inventory.stockLevel = newStock;
    productList[index].inventory.lastDateUpdated = new Date()
      .toISOString()
      .split('T')[0];

    updatedProducts.push(productList[index]);
  }

  // build transaction record
  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity * (1 - i.discount / 100),
    0
  );
  const taxRate = 0.12;
  const totalAmount = subtotal * (1 + taxRate);

  const transaction = {
    orderId: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    items: cartItems,
    paymentMethod,
    subtotal,
    tax: taxRate,
    totalAmount,
  };

  transactionHistory.push(transaction);

  return res.status(201).json({
    message: 'Checkout successful.',
    transaction,
    updatedProducts,
  });
};

const handleGetHistory = (_req, res) => {
  res.json({ history: transactionHistory });
};

const handleDeleteTransaction = (req, res) => {
  const { orderId } = req.params;
  console.log("Received orderId for deletion:", orderId); // Debugging
  const index = transactionHistory.findIndex((tx) => tx.orderId === orderId);

  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found." });
  }

  transactionHistory.splice(index, 1);
  res.status(200).json({ message: `Transaction ${orderId} deleted.` });
};

module.exports = {
  handleCheckout,
  handleGetHistory,
  handleDeleteTransaction,
};
