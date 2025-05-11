//sia-backend/app.js
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

const orderRoutes = require('./Ordering/orderRoutes');
const inventoryRoutes = require('./Inventory/inventoryRoutes');
const deliveryRoutes = require('./Delivery/deliveryRoutes'); 
const purchasingRoutes = require('./Purchasing/purchasingRoutes');
const posRoutes = require('./POS/posRoutes');
const staffRoutes = require('./StaffManagement/staffRoutes');

app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/delivery', deliveryRoutes); 
app.use('/api/purchasing', purchasingRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/staff', staffRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
