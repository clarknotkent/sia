// src/private/Ordering/QuotationTable.jsx

import React, { useState } from 'react';
import ViewQuotationModal from './Modals/ViewQuotationModal';
import EditQuotationModal from './Modals/EditQuotationModal';
import AddQuotationModal from './Modals/AddQuotationModal';
import Pagination from '../../components/Pagination';

const QuotationTable = () => {
    const [quotations, setQuotations] = useState([
        {
            quotationID: 'Q001',
            quotationDate: '2025-03-01',
            status: 'Pending',
            totalAmount: 5000.00,
            client: {
                name: 'ABC Pharmacy',
                licenseNo: 'FDA12345',
                contactPerson: 'Jane Dela Cruz',
                contactNumber: '0917-123-4567',
                email: 'abc@pharmacy.com',
            },
            items: [
                { name: 'Paracetamol', quantity: 10, unitPrice: 20.00 },
                { name: 'Ibuprofen', quantity: 5, unitPrice: 35.00 },
            ],
        },
        {
            quotationID: 'Q002',
            quotationDate: '2025-03-02',
            status: 'Approved',
            totalAmount: 8900.00,
            client: {
                name: 'XYZ Drugstore',
                licenseNo: 'FDA67890',
                contactPerson: 'Mark Santos',
                contactNumber: '0918-456-7890',
                email: 'xyz@drugstore.com',
            },
            items: [
                { name: 'Amoxicillin', quantity: 8, unitPrice: 50.00 },
                { name: 'Cough Syrup', quantity: 4, unitPrice: 75.00 },
            ],
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const filtered = quotations.filter(q =>
        (q.quotationID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.client?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? q.status === statusFilter : true)
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

    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [modalType, setModalType] = useState(null);

    const openModal = (quotation, type) => {
        setSelectedQuotation(quotation);
        setModalType(type);
    };

    const closeModal = () => setModalType(null);

    const handleAdd = (newQuotation) => {
        setQuotations([...quotations, newQuotation]);
        closeModal();
    };

    const handleSave = (updatedQuotation) => {
        setQuotations(quotations.map(q =>
            q.quotationID === updatedQuotation.quotationID ? updatedQuotation : q
        ));
        closeModal();
    };

    const handleRemove = (quotationID) => {
        const confirmed = window.confirm("Are you sure you want to remove this quotation?");
        if (confirmed) {
            setQuotations(prev => prev.filter(q => q.quotationID !== quotationID));
        }
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quotations</h2>

            {/* Search & Filter Bar */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by ID or Client"
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
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => openModal(null, 'add')}
                >
                    + Add Quotation
                </button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300 text-gray-800 text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('quotationID')}>Quotation ID</th>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('clientName')}>Client</th>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('quotationDate')}>Date</th>
                        <th className="border p-2 text-right">Total</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map(q => (
                        <tr key={q.quotationID} className="hover:bg-gray-100">
                            <td className="border p-2">{q.quotationID}</td>
                            <td className="border p-2">{q.client?.name}</td>
                            <td className="border p-2">{q.quotationDate}</td>
                            <td className="border p-2 text-right">₱{q.totalAmount?.toLocaleString()}</td>
                            <td className="border p-2">{q.status}</td>
                            <td className="border p-2 text-center">
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => openModal(q, 'view')}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        onClick={() => openModal(q, 'edit')}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        onClick={() => handleRemove(q.quotationID)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Modals */}
            {modalType === 'view' && selectedQuotation && (
                <ViewQuotationModal quotation={selectedQuotation} onClose={closeModal} />
            )}
            {modalType === 'edit' && selectedQuotation && (
                <EditQuotationModal quotation={selectedQuotation} onSave={handleSave} onClose={closeModal} />
            )}
            {modalType === 'add' && (
                <AddQuotationModal onAdd={handleAdd} onClose={closeModal} />
            )}
        </div>
    );
};

export default QuotationTable;
