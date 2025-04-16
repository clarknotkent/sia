// POS/posRoutes.js
const express = require("express");
const router = express.Router();
const { handleCheckout } = require('./posController'); // if in same folder

router.post("/checkout", handleCheckout); // ✅ connect route to controller

module.exports = router;
