const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// uploaded images from /public/assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Import routes
const orderRoutes = require('./Ordering/orderRoutes');
const inventoryRoutes = require('./Inventory/inventoryRoutes');
const deliveryRoutes = require('./Delivery/deliveryRoutes');
const purchasingRoutes = require('./Purchasing/purchasingRoutes');
const posRoutes = require('./POS/posRoutes');
const staffRoutes = require('./StaffManagement/staffRoutes');

// Use routes
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/purchasing', purchasingRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/staff', staffRoutes);

module.exports = app;
