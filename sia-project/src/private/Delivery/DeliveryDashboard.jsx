import { useState } from "react";
import Sidebar from "../Sidebar";
import ShipList from "./ShipList";
import DeliveryTable from "./DeliveryTable";

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Delivery Management</h1>

        <div className="mb-4 flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("orders")}
          >
            Ship List
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "deliveries" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("deliveries")}
          >
            Delivery Table
          </button>
        </div>

        {activeTab === "orders" ? <ShipList /> : <DeliveryTable />}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
