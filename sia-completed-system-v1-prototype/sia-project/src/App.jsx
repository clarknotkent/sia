// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./public/LoginPage";
import Dashboard from "./private/Dashboard";
import StaffMgmt from "./private/StaffManagement/StaffManagement";
import Delivery from "./private/Delivery/DeliveryDashboard";
import InventoryDashboard from "./private/Inventory/InventoryDashboard";
import PurchasingDashboard from "./private/Purchasing/PurchasingDashboard";
import OrderingDashboard from "./private/Ordering/OrderingDashboard";
import POSModule from "./private/POS/POSDashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    // Add basename="/sia" here so all routes are prefixed correctly
    <Router basename="/sia">
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
                  localStorage.removeItem("isLoggedIn");
                }}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/staff-management"
          element={
            isLoggedIn ? <StaffMgmt /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/delivery-management"
          element={
            isLoggedIn ? <Delivery /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/inventory-management"
          element={
            isLoggedIn ? (
              <InventoryDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/purchasing"
          element={
            isLoggedIn ? (
              <PurchasingDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/ordering"
          element={
            isLoggedIn ? (
              <OrderingDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/pos-module"
          element={
            isLoggedIn ? <POSModule /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
