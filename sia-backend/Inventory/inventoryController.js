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
    image: "https://via.placeholder.com/300x300.png?text=Paracetamol",
    inventory: {
      stockLevel: 50,
      reservedStock: 0,
      thresholdLevel: 5,
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
    price: 5.0,
    image: "https://via.placeholder.com/300x300.png?text=Amoxicillin",
    inventory: {
      stockLevel: 25,
      reservedStock: 0,
      thresholdLevel: 5,
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
    price: 5.0,
    image: "https://via.placeholder.com/300x300.png?text=Cefalexin",
    inventory: {
      stockLevel: 10,
      reservedStock: 0,
      thresholdLevel: 5,
      lastDateUpdated: "2024-04-04",
    },
  },
  {
    id: "RPROD-3001",
    genericName: "Paracetamol",
    brandName: "Biogesic",
    unitOfMeasurement: "Tablet",
    packing: "Blister Pack",
    lotNum: "LOT-001",
    expiryDate: "2025-12-31",
    price: 5.0,
    image: "https://via.placeholder.com/300x300.png?text=Paracetamol",
    inventory: {
      stockLevel: 0,
      reservedStock: 0,
      thresholdLevel: 5,
      lastDateUpdated: "2024-04-01",
    },
  },
];


  // ...other default products


// ✅ Get all products
const getAllProducts = (req, res) => {
  res.json(productList);
};

// ✅ Add product (with price)
const addProduct = (req, res) => {
  const {
    genericName,
    brandName,
    unitOfMeasurement,
    packing,
    lotNum,
    expiryDate,
    stockLevel,
    thresholdLevel,
    price,
  } = req.body;

  const id = `NPROD-${Date.now()}`;
  const imagePath = req.file ? `/assets/${req.file.filename}` : '';

  const newProduct = {
    id,
    genericName,
    brandName,
    unitOfMeasurement,
    packing,
    lotNum,
    expiryDate,
    price: parseFloat(price),
    image: imagePath,
    inventory: {
      stockLevel: parseInt(stockLevel),
      reservedStock: 0,
      thresholdLevel: parseInt(thresholdLevel) || 5,
      lastDateUpdated: new Date().toISOString().split("T")[0],
    },
  };

  productList.push(newProduct);
  res.status(201).json(newProduct);
};

// ✅ Update product (including price)
const updateProduct = (req, res) => {
  const id = req.params.id;
  const index = productList.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const body = req.body || {};
  const {
    genericName,
    brandName,
    unitOfMeasurement,
    packing,
    lotNum,
    expiryDate,
    stockLevel,
    thresholdLevel,
    price,
  } = body;

  const updatedProduct = { ...productList[index] };

  if (genericName) updatedProduct.genericName = genericName;
  if (brandName) updatedProduct.brandName = brandName;
  if (unitOfMeasurement) updatedProduct.unitOfMeasurement = unitOfMeasurement;
  if (packing) updatedProduct.packing = packing;
  if (lotNum) updatedProduct.lotNum = lotNum;
  if (expiryDate) updatedProduct.expiryDate = expiryDate;
  if (price) updatedProduct.price = parseFloat(price);

  if (req.file) {
    updatedProduct.image = `/assets/${req.file.filename}`;
  }

  updatedProduct.inventory = {
    ...updatedProduct.inventory,
    stockLevel: stockLevel ? parseInt(stockLevel) : updatedProduct.inventory.stockLevel,
    thresholdLevel: thresholdLevel ? parseInt(thresholdLevel) : updatedProduct.inventory.thresholdLevel,
    lastDateUpdated: new Date().toISOString().split("T")[0],
  };

  productList[index] = updatedProduct;
  res.json(updatedProduct);
};

// ✅ Delete product
const deleteProduct = (req, res) => {
  const id = req.params.id;
  productList = productList.filter((p) => p.id !== id);
  res.status(204).send();
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  productList, // ✅ THIS LINE enables POS to access products
};
