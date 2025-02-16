// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './public/LoginPage';
import Dashboard from './private/Dashboard';
import StaffMgmt from './private/StaffManagement/StaffManagement';
import Delivery from './private/Delivery/Delivery';
import InventoryDashboard from './private/Inventory/InventoryDashboard'; // ✅ Keep the Inventory Module

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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
