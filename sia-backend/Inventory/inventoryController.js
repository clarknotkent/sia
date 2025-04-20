//sia-backend/Inventory/inventoryController.js
let productList = [
  {
    id: "NPROD-1001",
    genericName: "Paracetamol",
    brandName: "Biogesic",
    unitOfMeasurement: "Tablet",
    packing: "Blister Pack",
    lotNum: "LOT-001",
    expiryDate: "2025-12-31",
    price: 5.0,
    image: "/assets/paracetamol.png",
    inventory: {
      stockLevel: 50,
      reservedStock: 5,
      lastDateUpdated: "2024-04-01",
    },
  },
  {
    id: "NPROD-1002",
    genericName: "Amoxicillin",
    brandName: "Amoxil",
    unitOfMeasurement: "Capsule",
    packing: "Bottle",
    lotNum: "LOT-002",
    expiryDate: "2026-03-15",
    price: 10.0,
    image: "/assets/amoxicillin.png",
    inventory: {
      stockLevel: 25,
      reservedStock: 2,
      lastDateUpdated: "2024-04-02",
    },
  },
  {
    id: "RPROD-2001",
    genericName: "Cefalexin",
    brandName: "Keflex",
    unitOfMeasurement: "Capsule",
    packing: "Box",
    lotNum: "LOT-003",
    expiryDate: "2025-11-20",
    price: 15.0,
    image: "/assets/cefalexin.png",
    inventory: {
      stockLevel: 10,
      reservedStock: 1,
      lastDateUpdated: "2024-04-04",
    },
  },
  {
    id: "RPROD-3001",
    genericName: "Ibuprofen",
    brandName: "Advil",
    unitOfMeasurement: "Tablet",
    packing: "Blister Pack",
    lotNum: "LOT-004",
    expiryDate: "2025-10-15",
    price: 8.0,
    image: "/assets/ibuprofen.png",
    inventory: {
      stockLevel: 100,
      reservedStock: 10,
      lastDateUpdated: "2024-04-05",
    },
  },
  {
    id: "NPROD-1003",
    genericName: "Metformin",
    brandName: "Glucophage",
    unitOfMeasurement: "Tablet",
    packing: "Bottle",
    lotNum: "LOT-005",
    expiryDate: "2026-01-01",
    price: 12.0,
    image: "/assets/metformin.png",
    inventory: {
      stockLevel: 75,
      reservedStock: 5,
      lastDateUpdated: "2024-04-06",
    },
  },
  {
    id: "RPROD-2002",
    genericName: "Losartan",
    brandName: "Cozaar",
    unitOfMeasurement: "Tablet",
    packing: "Blister Pack",
    lotNum: "LOT-006",
    expiryDate: "2025-09-30",
    price: 6.0,
    image: "/assets/losartan.png",
    inventory: {
      stockLevel: 40,
      reservedStock: 3,
      lastDateUpdated: "2024-04-07",
    },
  },
  {
    id: "NPROD-1004",
    genericName: "Salbutamol",
    brandName: "Ventolin",
    unitOfMeasurement: "Inhaler",
    packing: "Box",
    lotNum: "LOT-007",
    expiryDate: "2025-08-20",
    price: 20.0,
    image: "/assets/salbutamol.png",
    inventory: {
      stockLevel: 30,
      reservedStock: 2,
      lastDateUpdated: "2024-04-08",
    },
  },
  {
    id: "RPROD-3002",
    genericName: "Omeprazole",
    brandName: "Prilosec",
    unitOfMeasurement: "Capsule",
    packing: "Bottle",
    lotNum: "LOT-008",
    expiryDate: "2026-02-15",
    price: 18.0,
    image: "/assets/omeprazole.png",
    inventory: {
      stockLevel: 60,
      reservedStock: 4,
      lastDateUpdated: "2024-04-09",
    },
  },
  {
    id: "NPROD-1005",
    genericName: "Cetirizine",
    brandName: "Zyrtec",
    unitOfMeasurement: "Tablet",
    packing: "Blister Pack",
    lotNum: "LOT-009",
    expiryDate: "2025-07-10",
    price: 7.0,
    image: "/assets/cetirizine.png",
    inventory: {
      stockLevel: 90,
      reservedStock: 8,
      lastDateUpdated: "2024-04-10",
    },
  },
  {
    id: "RPROD-3003",
    genericName: "Amlodipine",
    brandName: "Norvasc",
    unitOfMeasurement: "Tablet",
    packing: "Blister Pack",
    lotNum: "LOT-010",
    expiryDate: "2025-06-25",
    price: 9.0,
    image: "/assets/amlodipine.png",
    inventory: {
      stockLevel: 50,
      reservedStock: 5,
      lastDateUpdated: "2024-04-11",
    },
  },
];

// GET all products (clamp negatives)
const getAllProducts = (req, res) => {
  productList.forEach(p => {
    p.inventory.stockLevel   = Math.max(0, p.inventory.stockLevel);
    p.inventory.reservedStock = Math.max(0, p.inventory.reservedStock);
  });
  res.json(productList);
};

// ADD new product
const addProduct = (req, res) => {
  const { genericName, brandName, unitOfMeasurement, packing, lotNum, expiryDate, stockLevel, price } = req.body;
  const id = `NPROD-${Date.now()}`;
  const newProduct = {
    id,
    genericName,
    brandName,
    unitOfMeasurement,
    packing,
    lotNum,
    expiryDate,
    price: parseFloat(price),
    image: req.file ? `/assets/${req.file.filename}` : "",
    inventory: {
      stockLevel: parseInt(stockLevel),
      reservedStock: 0,
      lastDateUpdated: new Date().toISOString().split("T")[0],
    },
  };
  productList.push(newProduct);
  res.status(201).json(newProduct);
};

// UPDATE (no negative stockLevel)
const updateProduct = (req, res) => {
  const idx = productList.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  const updated = { ...productList[idx], ...req.body };
  if (req.body.stockLevel != null) {
    const newLvl = parseInt(req.body.stockLevel);
    if (newLvl < 0) {
      return res.status(400).json({ error: "Stock level cannot be negative" });
    }
    updated.inventory.stockLevel = newLvl;
  }
  updated.inventory.lastDateUpdated = new Date().toISOString().split("T")[0];

  productList[idx] = updated;
  res.json(updated);
};

// DELETE product
const deleteProduct = (req, res) => {
  productList = productList.filter(p => p.id !== req.params.id);
  res.status(204).send();
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  productList,  // shared with ordering
};
