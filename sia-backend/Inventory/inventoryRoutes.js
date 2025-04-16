const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require('./inventoryController');

// ✅ Multer setup to store image in /public/assets
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/assets'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// ✅ API Routes
router.get('/', getAllProducts);
router.post('/', upload.single('image'), addProduct); // ✅ Supports multipart/form-data
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
