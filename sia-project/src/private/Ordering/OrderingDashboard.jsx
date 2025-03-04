// src/private/Ordering/OrderingDashboard.jsx

import React, { useState } from "react";
import Sidebar from "../Sidebar";
import ClientTable from "./ClientTable";
import QuotationTable from "./QuotationTable";
import OrderTable from "./OrderTable";

const OrderingDashboard = () => {
    const [activeTab, setActiveTab] = useState("clients");

    return (
        <div className="flex h-screen w-screen">
            <Sidebar /> {/* Flushed hard left */}
            <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Ordering Management</h1>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'clients' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => setActiveTab('clients')}
                    >
                        Clients
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'quotations' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => setActiveTab('quotations')}
                    >
                        Quotations
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                </div>

                {/* Main Content - Table Container */}
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    {activeTab === "clients" && <ClientTable />}
                    {activeTab === "quotations" && <QuotationTable />}
                    {activeTab === "orders" && <OrderTable />}
                </div>
            </div>
        </div>
    );
};

export default OrderingDashboard;
