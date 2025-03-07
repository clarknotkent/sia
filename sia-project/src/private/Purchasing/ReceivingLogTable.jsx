import React, { useState } from 'react';
import ViewReceivingLogModal from './Modals/ViewReceivingLogModal';
import Pagination from '../../components/Pagination';

const ReceivingLogTable = () => {
    const [logs, setLogs] = useState([
        { logID: 'RL001', poID: 'PO001', supplier: 'MediSupply Co.', dateReceived: '2025-03-05', status: 'Complete' },
        { logID: 'RL002', poID: 'PO002', supplier: 'PharmaDirect', dateReceived: '2025-03-06', status: 'Partial' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const filteredLogs = logs.filter(log =>
        (log.logID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.poID.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? log.status === statusFilter : true)
    );

    const sortedLogs = [...filteredLogs].sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedLogs = sortedLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(sortedLogs.length / pageSize);

    const [selectedLog, setSelectedLog] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = (log) => {
        setSelectedLog(log);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedLog(null);
        setModalOpen(false);
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Receiving Logs</h2>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by Log ID, PO Number, or Supplier"
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
                        <option value="Complete">Complete</option>
                        <option value="Partial">Partial</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('logID')}>Log ID</th>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('poID')}>PO Number</th>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('supplier')}>Supplier</th>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('dateReceived')}>Date Received</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedLogs.map(log => (
                        <tr key={log.logID} className="hover:bg-gray-100">
                            <td className="border p-2">{log.logID}</td>
                            <td className="border p-2">{log.poID}</td>
                            <td className="border p-2">{log.supplier}</td>
                            <td className="border p-2">{log.dateReceived}</td>
                            <td className="border p-2">{log.status}</td>
                            <td className="border p-2 text-center">
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    onClick={() => openModal(log)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {modalOpen && selectedLog && (
                <ViewReceivingLogModal log={selectedLog} onClose={closeModal} />
            )}
        </>
    );
};

export default ReceivingLogTable;
