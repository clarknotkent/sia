// src/private/Purchasing/PurchasingDashboard.jsx

import React, { useState } from "react";
import Sidebar from "../Sidebar";
import SuppliersTable from "./SuppliersTable";
import PurchaseOrdersTable from "./PurchaseOrdersTable";

const PurchasingDashboard = () => {
    const [activeTab, setActiveTab] = useState("suppliers");

    return (
        <div className="flex h-screen w-screen">
            <Sidebar /> {/* Flushed hard left */}
            <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Purchasing Management</h1>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'suppliers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => setActiveTab('suppliers')}
                    >
                        Suppliers
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'purchaseOrders' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => setActiveTab('purchaseOrders')}
                    >
                        Purchase Orders
                    </button>
                </div>

                {/* Main Content - Table Container */}
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    {activeTab === "suppliers" && <SuppliersTable />}
                    {activeTab === "purchaseOrders" && <PurchaseOrdersTable />}
                </div>
            </div>
        </div>
    );
};

export default PurchasingDashboard;
