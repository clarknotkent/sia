import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import DashboardChart from './DashboardChart';
import {
  ShoppingCart,
  Package,
  Truck,
  Users,
  ClipboardList,
  Warehouse,
} from 'lucide-react';

const Navbar = ({ onLogout }) => (
  <div className="w-full bg-white shadow-md p-4 flex justify-between items-center pr-6">
    <h1 className="text-xl font-semibold text-gray-800">Welcome, Admin</h1>
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
      onClick={onLogout}
    >
      Logout
    </button>
  </div>
);

const StatusChip = ({ label, color = 'green' }) => {
  const base = 'text-xs px-2 py-0.5 rounded font-medium';
  const styles = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return <span className={`${base} ${styles[color]}`}>{label}</span>;
};

const DashboardCard = ({ title, subtitle, status, statusColor, Icon, onClick }) => (
  <div
    className="bg-white p-6 rounded shadow-md border border-gray-300 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 flex gap-4 items-center min-h-[100px]"
    onClick={onClick}
  >
    <Icon className="w-8 h-8 text-blue-600" />
    <div className="flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        {title} {status && <StatusChip label={status} color={statusColor} />}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  </div>
);

const RecentActivity = () => {
  const mockActivity = [
    { type: 'Order', detail: 'New client order received', time: '2 mins ago' },
    { type: 'Delivery', detail: 'Delivery #1042 marked as delivered', time: '15 mins ago' },
    { type: 'Stock-In', detail: 'Paracetamol restocked (Batch #2025)', time: '30 mins ago' },
    { type: 'PO', detail: 'PO #0027 submitted to Supplier A', time: '1 hour ago' },
  ];

  return (
    <div className="bg-white p-6 rounded shadow-md border border-gray-300 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
      <ul className="space-y-3 text-sm">
        {mockActivity.map((item, idx) => (
          <li key={idx} className="border-b pb-2">
            <span className="font-medium text-blue-600">{item.type}</span>: {item.detail}
            <span className="block text-xs text-gray-400">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MainContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Supply Chain Overview</h2>

      {/* Bar Chart */}
      <DashboardChart />

      {/* Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="POS Module"
          subtitle="₱12,500 sales today · 34 walk-in transactions"
          Icon={ShoppingCart}
          status="Online"
          statusColor="green"
          onClick={() => navigate('/pos-module')}
        />
        <DashboardCard
          title="Inventory Management"
          subtitle="158 items in stock · 5 low-stock items"
          Icon={Warehouse}
          status="OK"
          statusColor="blue"
          onClick={() => navigate('/inventory-management')}
        />
        <DashboardCard
          title="Purchasing Module"
          subtitle="2 pending POs · Next delivery: Mar 26"
          Icon={Package}
          status="Pending"
          statusColor="yellow"
          onClick={() => navigate('/purchasing')}
        />
        <DashboardCard
          title="Order Management"
          subtitle="3 new orders · 1 awaiting payment"
          Icon={ClipboardList}
          status="New"
          statusColor="green"
          onClick={() => navigate('/ordering')}
        />
        <DashboardCard
          title="Delivery Management"
          subtitle="2 in transit · 5 delivered today"
          Icon={Truck}
          status="In Transit"
          statusColor="blue"
          onClick={() => navigate('/delivery-management')}
        />
        <DashboardCard
          title="Staff Management"
          subtitle="12 active staff · 1 pending approval"
          Icon={Users}
          status="Active"
          statusColor="green"
          onClick={() => navigate('/staff-management')}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar onLogout={onLogout} />
        <MainContent />
      </div>
    </div>
  );
};

export default Dashboard;
