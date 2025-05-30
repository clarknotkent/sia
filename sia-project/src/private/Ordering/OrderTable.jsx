import React, { useState } from 'react';
import ViewOrderModal from './Modals/ViewOrderModal';
import EditOrderModal from './Modals/EditOrderModal';
import RefundOrderModal from './Modals/RefundOrderModal';
import AddOrderModal from './Modals/AddOrderModal';
import Pagination from '../../components/Pagination';

const OrderTable = () => {
    const [orders, setOrders] = useState([
        {
            orderID: 'O001',
            orderDate: '2025-03-01',
            totalAmount: 5000,
            remainingBalance: 0,
            status: 'Pending',
            employee: 'John Doe',
            quotationID: 'Q001',
            client: {
                name: 'ABC Pharmacy',
                contactPerson: 'Jane Dela Cruz',
                contactNumber: '0917-123-4567',
                email: 'abc@pharmacy.com',
                licenseNo: 'FDA12345',
            },
            items: [
                { name: 'Paracetamol', quantity: 10, unitPrice: 20 },
                { name: 'Amoxicillin', quantity: 5, unitPrice: 60 },
            ],
        },
        {
            orderID: 'O002',
            orderDate: '2025-03-02',
            totalAmount: 8000,
            remainingBalance: 2000,
            status: 'Processing',
            employee: 'Jane Smith',
            quotationID: null,
            client: {
                name: 'XYZ Drugstore',
                contactPerson: 'Mark Santos',
                contactNumber: '0918-456-7890',
                email: 'xyz@drugstore.com',
                licenseNo: 'FDA67890',
            },
            items: [
                { name: 'Ibuprofen', quantity: 12, unitPrice: 40 },
            ],
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const filteredOrders = orders.filter(order =>
        (order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? order.status === statusFilter : true)
    );

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(sortedOrders.length / pageSize);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalType, setModalType] = useState(null);

    const openModal = (order, type) => {
        setSelectedOrder(order);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setModalType(null);
    };

    const handleSave = (updatedOrder) => {
        setOrders(orders.map(order =>
            order.orderID === updatedOrder.orderID ? updatedOrder : order
        ));
        closeModal();
    };

    const handleAdd = (newOrder) => {
        setOrders([...orders, newOrder]);
        closeModal();
    };

    const handleRefund = (refundedOrder) => {
        setOrders(orders.map(order =>
            order.orderID === refundedOrder.orderID ? refundedOrder : order
        ));
        closeModal();
    };

    const handleRemove = (orderID) => {
        const confirmed = window.confirm('Are you sure you want to remove this order?');
        if (confirmed) {
            setOrders(prev => prev.filter(o => o.orderID !== orderID));
        }
    };

    const statusColors = {
        Pending: 'bg-yellow-200 text-yellow-800',
        Processing: 'bg-blue-200 text-blue-800',
        Delivered: 'bg-green-200 text-green-800',
        Refunded: 'bg-purple-200 text-purple-800',
        Cancelled: 'bg-red-200 text-red-800',
    };

    const toggleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Orders</h2>

            {/* Search & Filter Bar */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by Order ID or Client Name"
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
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => openModal(null, 'add')}>
                    + Add New Order
                </button>
            </div>

            {/* Orders Table */}
            <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('orderID')}>Order ID</th>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('client')}>Client</th>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('orderDate')}>Order Date</th>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('totalAmount')}>Total Amount</th>
                        <th className="border p-2">Remaining Balance</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Employee</th>
                        <th className="border p-2">Quotation Ref</th>
                        <th className="border p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedOrders.map((order) => (
                        <tr key={order.orderID} className="hover:bg-gray-100">
                            <td className="border p-2">{order.orderID}</td>
                            <td className="border p-2">{order.client?.name}</td>
                            <td className="border p-2">{order.orderDate}</td>
                            <td className="border p-2">₱{order.totalAmount.toLocaleString()}</td>
                            <td className="border p-2">₱{order.remainingBalance.toLocaleString()}</td>
                            <td className="border p-2">
                                <span className={`px-2 py-1 rounded ${statusColors[order.status]}`}>{order.status}</span>
                            </td>
                            <td className="border p-2">{order.employee}</td>
                            <td className="border p-2">{order.quotationID || '—'}</td>
                            <td className="border p-2 text-center space-x-1">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => openModal(order, 'view')}>
                                    View
                                </button>
                                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        onClick={() => openModal(order, 'edit')}>
                                    Edit
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => openModal(order, 'refund')}>
                                    Refund
                                </button>
                                <button className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                                        onClick={() => handleRemove(order.orderID)}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Modals */}
            {modalType === 'add' && <AddOrderModal onAdd={handleAdd} onClose={closeModal} />}
            {modalType === 'view' && selectedOrder && <ViewOrderModal order={selectedOrder} onClose={closeModal} />}
            {modalType === 'edit' && selectedOrder && <EditOrderModal order={selectedOrder} onSave={handleSave} onClose={closeModal} />}
            {modalType === 'refund' && selectedOrder && <RefundOrderModal order={selectedOrder} onRefund={handleRefund} onClose={closeModal} />}
        </div>
    );
};

export default OrderTable;
