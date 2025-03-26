// src/private/Purchasing/PurchaseOrdersTable.jsx
import React, { useState } from 'react';
import ViewPurchaseOrderModal from './Modals/ViewPurchaseOrderModal';
import EditPurchaseOrderModal from './Modals/EditPurchaseOrderModal';
import AddPurchaseOrderModal from './Modals/AddPurchaseOrderModal';
import Pagination from '../../components/Pagination';

const PurchaseOrdersTable = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([
        { poID: 'PO001', supplier: 'MediSupply Co.', orderDate: '2025-03-01', status: 'Pending', items: [] },
        { poID: 'PO002', supplier: 'PharmaDirect', orderDate: '2025-03-02', status: 'Delivered', items: [] },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const filtered = purchaseOrders.filter(po =>
        ((po.poID || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
         (po.supplier || "").toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? po.status === statusFilter : true)
    );

    const sorted = [...filtered].sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(sorted.length / pageSize);

    const [selectedPO, setSelectedPO] = useState(null);
    const [modalType, setModalType] = useState(null);

    const openModal = (po, type) => {
        setSelectedPO(po);
        setModalType(type);  // Set the modal type to 'view', 'edit', etc.
    };

    const closeModal = () => {
        setSelectedPO(null);
        setModalType(null);
    };

    const handleAdd = (newPO) => {
        setPurchaseOrders([...purchaseOrders, newPO]);
        closeModal();
    };

    const handleSave = (updatedPO) => {
        setPurchaseOrders(purchaseOrders.map(po =>
            po.poID === updatedPO.poID ? updatedPO : po
        ));
        closeModal();
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
        <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Orders</h2>

            {/* Search & Filter Bar */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by PO ID or Supplier"
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
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => openModal(null, 'add')}
                >
                    + Add Purchase Order
                </button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('poID')}>
                            PO ID
                        </th>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('supplier')}>
                            Supplier
                        </th>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('orderDate')}>
                            Order Date
                        </th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map(po => (
                        <tr key={po.poID} className="hover:bg-gray-100">
                            <td className="border p-2">{po.poID}</td>
                            <td className="border p-2">{po.supplier}</td>
                            <td className="border p-2">{po.orderDate}</td>
                            <td className="border p-2">{po.status}</td>
                            <td className="border p-2 text-center space-x-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => openModal(po, 'view')}>
                                    View
                                </button>
                                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        onClick={() => openModal(po, 'edit')}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Modals */}
            {modalType === 'view' && selectedPO && <ViewPurchaseOrderModal order={selectedPO} onClose={closeModal} />}
            {modalType === 'edit' && selectedPO && <EditPurchaseOrderModal po={selectedPO} onSave={handleSave} onClose={closeModal} />}
            {modalType === 'add' && <AddPurchaseOrderModal onAdd={handleAdd} onClose={closeModal} />}
        </>
    );
};

export default PurchaseOrdersTable;
