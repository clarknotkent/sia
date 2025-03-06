// src/private/Sidebar.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define the base button style - Make all buttons dark
  const baseButtonClasses =
    "p-3 block rounded transition bg-gray-900 text-white border border-gray-700 w-full text-center";

  // Function to check if the button is active and apply transparency
  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `${baseButtonClasses} ${isActive ? 'bg-opacity-40' : 'hover:bg-opacity-80'}`;
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <button className={getLinkClasses('/dashboard')} onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
        <button className={getLinkClasses('/staff-management')} onClick={() => navigate('/staff-management')}>
          Staff Management
        </button>
        <button className={getLinkClasses('/pos-module')} onClick={() => navigate('/pos-module')}>
          POS Module
        </button>
        <button className={getLinkClasses('/ordering-module')} onClick={() => navigate('/ordering')}>
          Order Management
        </button>
        <button className={getLinkClasses('/purchasing')} onClick={() => navigate('/purchasing')}>
          Purchasing Module
        </button>
        <button className={getLinkClasses('/inventory-management')} onClick={() => navigate('/inventory-management')}>
          Inventory Management
        </button>
        <button className={getLinkClasses('/delivery-management')} onClick={() => navigate('/delivery-management')}>
          Delivery Management
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
