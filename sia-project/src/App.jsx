// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './public/LoginPage';
import Dashboard from './private/Dashboard';
import StaffManagement from './private/StaffManagement/StaffManagement';


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
              <Dashboard onLogout={() => {
                setIsLoggedIn(false);
                localStorage.removeItem('isLoggedIn');
              }} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/staff-management"
          element={
            isLoggedIn ? (
              <StaffManagement />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
