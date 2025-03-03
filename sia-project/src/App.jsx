// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './public/LoginPage'; // src/public/LoginPage.jsx
import Dashboard from './private/Dashboard'; // src/private/Dashboard.jsx
import StaffMgmt from './private/StaffManagement/StaffManagement'; // src/private/StaffManagement/StaffManagement.jsx
import Delivery from './private/Delivery/Delivery'; // src/private/Delivery/Delivery.jsx
import InventoryDashboard from './private/Inventory/InventoryDashboard'; // src/private/Inventory/InventoryDashboard.jsx
import PurchasingDashboard from './private/Purchasing/PurchasingDashboard'; // src/private/Purchasing/PurchasingDashboard.jsx
import OrderingDashboard from "./private/Ordering/OrderingDashboard"; // src/private/Ordering/OrderingDashboard.jsx



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard
                onLogout={() => {
                  setIsLoggedIn(false);
                  localStorage.removeItem('isLoggedIn');
                }}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/staff-management"
          element={isLoggedIn ? <StaffMgmt /> : <Navigate to="/login" />}
        />
        <Route
          path="/delivery-management"
          element={isLoggedIn ? <Delivery /> : <Navigate to="/login" />}
        />
        <Route
          path="/inventory-management"
          element={isLoggedIn ? <InventoryDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/purchasing"
          element={isLoggedIn ? <PurchasingDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/ordering"
          element={isLoggedIn ? <OrderingDashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
