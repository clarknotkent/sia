import { useState } from 'react';
import Sidebar from '../Sidebar';
import SuppliersTable from './SuppliersTable';
import PurchaseOrdersTable from './PurchaseOrdersTable';
import ReceivingLogTable from './ReceivingLogTable';

const PurchasingDashboard = () => {
  const [activeTab, setActiveTab] = useState('suppliers');

  const tabs = [
    { key: 'suppliers', label: 'Suppliers', component: <SuppliersTable /> },
    { key: 'purchaseOrders', label: 'Purchase Orders', component: <PurchaseOrdersTable /> },
    { key: 'receivingLogs', label: 'Receiving Logs', component: <ReceivingLogTable /> },
  ];

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Purchasing Management
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Render Tables */}
        {tabs.find(tab => tab.key === activeTab)?.component}
      </div>
    </div>
  );
};

export default PurchasingDashboard;
