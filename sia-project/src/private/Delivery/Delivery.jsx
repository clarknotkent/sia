// src/private/Delivery/Delivery.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Pagination from "../../components/Pagination";

const Delivery = () => {
    const [deliveries, setDeliveries] = useState([
        { id: 1, customer: "Alice Johnson", address: "123 Main St", driver: "", status: "Pending", date: "2025-02-20" },
        { id: 2, customer: "Bob Williams", address: "456 Elm St", driver: "", status: "In Transit", date: "2025-02-21" },
        { id: 3, customer: "Charlie Davis", address: "789 Pine St", driver: "Alex Lim", status: "Delivered", date: "2025-02-22" },
        { id: 4, customer: "Emma Wilson", address: "567 Maple St", driver: "Sarah Cruz", status: "Failed", date: "2025-02-23" },
        { id: 5, customer: "Jane Doe", address: "987 Oak St", driver: "", status: "Pending", date: "2025-02-24" },
        { id: 6, customer: "John Smith", address: "654 Cedar St", driver: "", status: "Pending", date: "2025-02-25" }
    ]);

    const drivers = ["Mark Reyes", "Sarah Cruz", "Alex Lim", "Peter Go"];
    const statuses = ["Pending", "In Transit", "Delivered", "Failed"];

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const updateDelivery = (id, field, value) => {
        setDeliveries((prev) =>
            prev.map((delivery) => (delivery.id === id ? { ...delivery, [field]: value } : delivery))
        );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "text-yellow-700 bg-yellow-100 border-yellow-500";
            case "In Transit":
                return "text-blue-700 bg-blue-100 border-blue-500";
            case "Delivered":
                return "text-green-700 bg-green-100 border-green-500";
            case "Failed":
                return "text-red-700 bg-red-100 border-red-500";
            default:
                return "text-gray-700 bg-gray-100 border-gray-500";
        }
    };

    // Filtered + Search Logic
    const filteredDeliveries = deliveries.filter(delivery =>
        (delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
         delivery.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? delivery.status === statusFilter : true)
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredDeliveries.length / pageSize);
    const paginatedDeliveries = filteredDeliveries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="flex h-screen w-screen">
            <Sidebar />

            <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Delivery Management</h1>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                    {/* Search & Filter Bar */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search by Customer Name or Address"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border p-2 rounded bg-white text-gray-800"
                                style={{ width: '400px' }}
                            />
                            <select
                                className="border p-2 rounded bg-white text-gray-800"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Delivery Table */}
                    <table className="w-full border border-gray-300 text-black">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border p-2">Order ID</th>
                                <th className="border p-2">Customer Name</th>
                                <th className="border p-2">Delivery Address</th>
                                <th className="border p-2">Assigned Driver</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Delivery Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDeliveries.map((delivery) => (
                                <tr key={delivery.id} className="text-center">
                                    <td className="border p-2">{delivery.id}</td>
                                    <td className="border p-2">{delivery.customer}</td>
                                    <td className="border p-2">{delivery.address}</td>

                                    {/* Driver Dropdown */}
                                    <td className="border p-2">
                                        <select
                                            className="border border-gray-300 p-1 rounded bg-white text-black"
                                            value={delivery.driver}
                                            onChange={(e) => updateDelivery(delivery.id, "driver", e.target.value)}
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.map((driver) => (
                                                <option key={driver} value={driver}>
                                                    {driver}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Status Dropdown */}
                                    <td className="border p-2">
                                        <select
                                            className={`border p-1 rounded text-center ${getStatusClass(delivery.status)}`}
                                            value={delivery.status}
                                            onChange={(e) => updateDelivery(delivery.id, "status", e.target.value)}
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status} className={getStatusClass(status)}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="border p-2">{delivery.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Delivery;
