// src/private/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkClasses = (path) =>
    `p-2 rounded cursor-pointer ${location.pathname === path ? 'bg-gray-700' : 'hover:bg-gray-700'}`;

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li className={getLinkClasses('/dashboard')} onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li className={getLinkClasses('/staff-management')} onClick={() => navigate('/staff-management')}>Staff Management</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">POS Module</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Ordering Module</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Purchasing Module</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Inventory Management</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Delivery Management</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">System Maintenance</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
