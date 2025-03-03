// src/private/Purchasing/PurchasingDashboard.jsx

import { useState } from "react";
import Sidebar from "../Sidebar"; 
import SupplierList from "./SupplierList";
import PurchaseRequest from "./PurchaseRequest";
import OrderTracking from "./OrderTracking";
import StockVerification from "./StockVerification";

const PurchasingDashboard = () => {
  const [activeTab, setActiveTab] = useState("suppliers");

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Purchasing Dashboard</h2>

        <div className="flex gap-4 mb-4">
          <button onClick={() => setActiveTab("suppliers")} className="bg-blue-500 text-white px-4 py-2 rounded">Supplier List</button>
          <button onClick={() => setActiveTab("requests")} className="bg-blue-500 text-white px-4 py-2 rounded">Purchase Requests</button>
          <button onClick={() => setActiveTab("orders")} className="bg-blue-500 text-white px-4 py-2 rounded">Order Tracking</button>
          <button onClick={() => setActiveTab("stock")} className="bg-blue-500 text-white px-4 py-2 rounded">Stock Verification</button>
        </div>

        <div className="bg-white p-6 rounded shadow-md">
          {activeTab === "suppliers" && <SupplierList />}
          {activeTab === "requests" && <PurchaseRequest />}
          {activeTab === "orders" && <OrderTracking />}
          {activeTab === "stock" && <StockVerification />}
        </div>
      </div>
    </div>
  );
};

export default PurchasingDashboard;
