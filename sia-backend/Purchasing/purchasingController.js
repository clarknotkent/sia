let purchaseOrders = [];
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

// Get all purchase orders
const getAllPurchases = (req, res) => {
  res.json(purchaseOrders);
};

// Add a new purchase and stock-in to inventory
const addPurchase = (req, res) => {
  const { supplierName, items } = req.body;

  for (let item of items) {
    const existing = inventory.find(p => 
      p.genericName === item.genericName &&
      p.brandName === item.brandName &&
      p.unit === item.unit &&
      p.expiryDate === item.expiryDate
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      inventory.push({ id: Date.now() + Math.random(), ...item });
    }
  }

  const newPO = {
    id: Date.now(),
    supplierName,
    items,
    received: true
  };

  purchaseOrders.push(newPO);
  res.status(201).json(newPO);
};

module.exports = {
  getAllPurchases,
  addPurchase
};
