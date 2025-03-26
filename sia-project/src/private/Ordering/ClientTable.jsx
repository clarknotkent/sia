// src/private/Ordering/ClientTable.jsx

import React, { useState } from 'react';
import ViewClientModal from './Modals/ViewClientModal';
import EditClientModal from './Modals/EditClientModal';
import AddClientModal from './Modals/AddClientModal';
import Pagination from '../../components/Pagination';

const ClientTable = () => {
    const [clients, setClients] = useState([
        {
            clientID: 'C001',
            name: 'ABC Pharmacy',
            licenseNo: 'FDA12345',
            contactPerson: 'Jane Dela Cruz',
            contactNumber: '0917-123-4567',
            email: 'abc@pharmacy.com',
        },
        {
            clientID: 'C002',
            name: 'XYZ Drugstore',
            licenseNo: 'FDA67890',
            contactPerson: 'Mark Santos',
            contactNumber: '0918-456-7890',
            email: 'xyz@drugstore.com',
        },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const filteredClients = clients.filter(client =>
        client.clientID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedClients = [...filteredClients].sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedClients = sortedClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(sortedClients.length / pageSize);

    const [selectedClient, setSelectedClient] = useState(null);
    const [modalType, setModalType] = useState(null);

    const openModal = (client, type) => {
        setSelectedClient(client);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedClient(null);
        setModalType(null);
    };

    const handleSave = (updatedClient) => {
        setClients(clients.map(client =>
            client.clientID === updatedClient.clientID ? updatedClient : client
        ));
        closeModal();
    };

    const handleAdd = (newClient) => {
        setClients([...clients, newClient]);
        closeModal();
    };

    const handleRemove = (clientID) => {
        const confirmed = window.confirm("Are you sure you want to remove this client?");
        if (confirmed) {
            setClients(clients.filter(client => client.clientID !== clientID));
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Registered Clients</h2>

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
                    + Add New Client
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-gray-800 text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('clientID')}>Client ID</th>
                        <th className="border p-2 cursor-pointer" onClick={() => toggleSort('name')}>Company Name</th>
                        <th className="border p-2">License No.</th>
                        <th className="border p-2">Contact Person</th>
                        <th className="border p-2">Contact No.</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedClients.map((client) => (
                        <tr key={client.clientID} className="hover:bg-gray-100">
                            <td className="border p-2">{client.clientID}</td>
                            <td className="border p-2">{client.name}</td>
                            <td className="border p-2">{client.licenseNo}</td>
                            <td className="border p-2">{client.contactPerson}</td>
                            <td className="border p-2">{client.contactNumber}</td>
                            <td className="border p-2">{client.email}</td>
                            <td className="border p-2 text-center space-x-1">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    onClick={() => openModal(client, 'view')}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                    onClick={() => openModal(client, 'edit')}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                    onClick={() => handleRemove(client.clientID)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Modals */}
            {modalType === 'view' && selectedClient && (
                <ViewClientModal client={selectedClient} onClose={closeModal} />
            )}
            {modalType === 'edit' && selectedClient && (
                <EditClientModal client={selectedClient} onSave={handleSave} onClose={closeModal} />
            )}
            {modalType === 'add' && (
                <AddClientModal onAdd={handleAdd} onClose={closeModal} />
            )}
        </div>
    );
};

export default ClientTable;
