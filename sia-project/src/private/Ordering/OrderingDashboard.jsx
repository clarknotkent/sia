// src/private/Ordering/OrderingDashboard.jsx

import { useState } from "react";
import Sidebar from "../Sidebar";
import ClientTable from "./ClientTable";
import QuotationTable from "./QuotationTable";
import OrderTable from "./OrderTable";

const OrderingDashboard = () => {
    const [activeTab, setActiveTab] = useState("clients");

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100 text-gray-800">
                <h1 className="text-2xl font-bold mb-4">Ordering Module Dashboard</h1>

                {/* Tab Buttons */}
                <div className="flex gap-4 mb-6">
                    <button 
                        className={`px-4 py-2 rounded ${activeTab === 'clients' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'}`} 
                        onClick={() => setActiveTab('clients')}
                    >
                        Clients
                    </button>
                    <button 
                        className={`px-4 py-2 rounded ${activeTab === 'quotations' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'}`} 
                        onClick={() => setActiveTab('quotations')}
                    >
                        Quotations
                    </button>
                    <button 
                        className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'}`} 
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                </div>

                {/* Tab Content */}
                <div className="border p-4 rounded bg-white text-gray-800 shadow">
                    {activeTab === "clients" && <ClientTable />}
                    {activeTab === "quotations" && <QuotationTable />}
                    {activeTab === "orders" && <OrderTable />}
                </div>
            </div>
        </div>
    );
};

export default OrderingDashboard;
