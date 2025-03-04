// src/private/Ordering/QuotationTable.jsx

import React, { useState } from 'react';
import ViewQuotationModal from './Modals/ViewQuotationModal';
import EditQuotationModal from './Modals/EditQuotationModal';
import AddQuotationModal from './Modals/AddQuotationModal';
import Pagination from '../../components/Pagination';

const QuotationTable = () => {
    const [quotations, setQuotations] = useState([
        { quotationID: 'Q001', clientName: 'ABC Pharmacy', quotationDate: '2025-03-01', status: 'Pending' },
        { quotationID: 'Q002', clientName: 'XYZ Drugstore', quotationDate: '2025-03-02', status: 'Approved' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const filtered = quotations.filter(q =>
        (q.quotationID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.clientName.toLowerCase().includes(searchTerm.toLowerCase())) &&
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
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by ID or Client"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-1/3 bg-white text-gray-800"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded bg-white text-gray-800"
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => openModal(null, 'add')}>
                    + Add Quotation
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-gray-800">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('quotationID')}>Quotation ID</th>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('clientName')}>Client</th>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('quotationDate')}>Date</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map(q => (
                        <tr key={q.quotationID}>
                            <td className="border p-2">{q.quotationID}</td>
                            <td className="border p-2">{q.clientName}</td>
                            <td className="border p-2">{q.quotationDate}</td>
                            <td className="border p-2">{q.status}</td>
                            <td className="border p-2 space-x-2">
                                <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => openModal(q, 'view')}>View</button>
                                <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => openModal(q, 'edit')}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

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
