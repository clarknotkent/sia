const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff
} = require('./staffController');

router.get('/', getAllStaff);
router.post('/', addStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;
