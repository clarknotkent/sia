// src/private/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check active class
  const getLinkClasses = (path) =>
    `p-3 block rounded transition ${
      location.pathname === path ? 'bg-gray-700 text-white font-semibold' : 'hover:bg-gray-700'
    }`;

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4 flex flex-col">
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
        <button className={getLinkClasses('/ordering-module')} onClick={() => navigate('/ordering-module')}>
          Ordering Module
        </button>
        <button className={getLinkClasses('/purchasing-module')} onClick={() => navigate('/purchasing-module')}>
          Purchasing Module
        </button>
        <button className={getLinkClasses('/inventory-management')} onClick={() => navigate('/inventory-management')}>
          Inventory Management
        </button>
        <button className={getLinkClasses('/delivery-management')} onClick={() => navigate('/delivery-management')}>
          Delivery Management
        </button>
        <button className={getLinkClasses('/system-maintenance')} onClick={() => navigate('/system-maintenance')}>
          System Maintenance
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
