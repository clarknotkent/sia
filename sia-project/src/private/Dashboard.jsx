// src/private/Dashboard.jsx

import React from 'react';
import Sidebar from './Sidebar'; // src/private/Sidebar.jsx
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => (
  <div className="w-full bg-white shadow-md p-4 flex justify-between items-center">
    <h1 className="text-xl font-semibold text-gray-800">Welcome, Admin</h1>
    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onLogout}>Logout</button>
  </div>
);

const DashboardCard = ({ title, onClick }) => (
  <div
    className="bg-white p-6 rounded shadow-md text-center border-2 border-black cursor-pointer hover:bg-gray-200"
    onClick={onClick}
  >
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
  </div>
);

const MainContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="Staff Management" onClick={() => navigate('/staff-management')} />
        <DashboardCard title="POS Module" />
        <DashboardCard title="Ordering Module" />
        <DashboardCard title="Purchasing Module" onClick={() => navigate('/purchasing')} />
        <DashboardCard title="Inventory Management" onClick={() => navigate('/inventory-management')} />
        <DashboardCard title="Delivery Management" onClick={() => navigate('/delivery-management')} />
        <DashboardCard title="System Maintenance" />
      </div>
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar /> {/* src/private/Sidebar.jsx */}
      <div className="flex flex-col flex-1">
        <Navbar onLogout={onLogout} />
        <MainContent />
      </div>
    </div>
  );
};

export default Dashboard;
