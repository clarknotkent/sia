//src/private/Purchasing/SuppliersTable.jsx
import React, { useState } from 'react';
import ViewSupplierModal from './Modals/ViewSupplierModal';
import EditSupplierModal from './Modals/EditSupplierModal';
import AddSupplierModal from './Modals/AddSupplierModal';
import Pagination from '../../components/Pagination';

const SuppliersTable = () => {
    const [suppliers, setSuppliers] = useState([
        { supplierID: 'S001', name: 'MediSupply Co.', contactPerson: 'Juan Dela Cruz', contactNumber: '09123456789' },
        { supplierID: 'S002', name: 'PharmaDirect', contactPerson: 'Ana Santos', contactNumber: '09876543210' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplierID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedSuppliers = sortedSuppliers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(sortedSuppliers.length / pageSize);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [modalType, setModalType] = useState(null);

    const openModal = (supplier, type) => {
        setSelectedSupplier(supplier);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedSupplier(null);
        setModalType(null);
    };

    const handleSave = (updatedSupplier) => {
        setSuppliers(suppliers.map(supplier =>
            supplier.supplierID === updatedSupplier.supplierID ? updatedSupplier : supplier
        ));
        closeModal();
    };

    const handleAdd = (newSupplier) => {
        setSuppliers([...suppliers, newSupplier]);
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Suppliers</h2>

            {/* Search & Add Bar */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by ID or Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded bg-white text-gray-800"
                    style={{ width: '400px' }}
                />
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => openModal(null, 'add')}
                >
                    + Add Supplier
                </button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('supplierID')}>
                            Supplier ID
                        </th>
                        <th className="border p-2 text-left cursor-pointer" onClick={() => toggleSort('name')}>
                            Name
                        </th>
                        <th className="border p-2 text-left">Contact Person</th>
                        <th className="border p-2 text-left">Contact Number</th>
                        <th className="border p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedSuppliers.map((supplier) => (
                        <tr key={supplier.supplierID} className="hover:bg-gray-100">
                            <td className="border p-2">{supplier.supplierID}</td>
                            <td className="border p-2">{supplier.name}</td>
                            <td className="border p-2">{supplier.contactPerson}</td>
                            <td className="border p-2">{supplier.contactNumber}</td>
                            <td className="border p-2 text-center space-x-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => openModal(supplier, 'view')}>
                                    View
                                </button>
                                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        onClick={() => openModal(supplier, 'edit')}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Modals */}
            {modalType === 'view' && selectedSupplier && (
                <ViewSupplierModal supplier={selectedSupplier} onClose={closeModal} />
            )}
            {modalType === 'edit' && selectedSupplier && (
                <EditSupplierModal supplier={selectedSupplier} onSave={handleSave} onClose={closeModal} />
            )}
            {modalType === 'add' && (
                <AddSupplierModal onAdd={handleAdd} onClose={closeModal} />
            )}
        </>
    );
};

export default SuppliersTable;
