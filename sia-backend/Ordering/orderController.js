let orderList = [];
let inventory = [
  {
    id: 1,
    genericName: "Paracetamol",
    brandName: "Biogesic",
    unit: "Tablet",
    quantity: 100,
    expiryDate: "2025-12-31"
  },
  {
    id: 2,
    genericName: "Amoxicillin",
    brandName: "Amoxil",
    unit: "Capsule",
    quantity: 200,
    expiryDate: "2026-06-30"
  }
];

// Get all orders
const getAllOrders = (req, res) => {
  res.json(orderList);
};

// Place a new order (deduct from inventory if possible)
const placeOrder = (req, res) => {
  const { items, customerName } = req.body;

  let insufficient = [];

  // Check stock
  for (let item of items) {
    const product = inventory.find(p => p.id === item.productId);
    if (!product || product.quantity < item.quantity) {
      insufficient.push({ productId: item.productId, available: product ? product.quantity : 0 });
    }
  }

  if (insufficient.length > 0) {
    return res.status(400).json({ error: "Insufficient stock", details: insufficient });
  }

  // Deduct stock
  for (let item of items) {
    const product = inventory.find(p => p.id === item.productId);
    product.quantity -= item.quantity;
  }

  const newOrder = {
    id: Date.now(),
    customerName,
    items,
    status: "confirmed"
  };

  orderList.push(newOrder);
  res.status(201).json(newOrder);
};

module.exports = {
  getAllOrders,
  placeOrder
};
