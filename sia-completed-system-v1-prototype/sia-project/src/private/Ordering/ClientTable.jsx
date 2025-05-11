// src/private/Ordering/ClientTable.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ViewClientModal from './Modals/ViewClientModal';
import EditClientModal from './Modals/EditClientModal';
import AddClientModal from './Modals/AddClientModal';
import Pagination from '../../components/Pagination';

const API_BASE_URL = 'http://localhost:5000/api';

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/clients`);
      const uniqueClients = removeDuplicateClients(response.data);
      setClients(uniqueClients);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const removeDuplicateClients = (clients) => {
    const seen = new Set();
    return clients.filter((client) => {
      if (seen.has(client.clientID)) return false;
      seen.add(client.clientID);
      return true;
    });
  };

  const filteredClients = clients.filter(client =>
    client.clientID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    return aValue < bValue ? (sortOrder === 'asc' ? -1 : 1) : aValue > bValue ? (sortOrder === 'asc' ? 1 : -1) : 0;
  });

  const paginatedClients = sortedClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(sortedClients.length / pageSize);

  const openModal = (client, type) => {
    setSelectedClient(client);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setModalType(null);
  };

  const handleSave = async (updatedClient) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/clients/${updatedClient.clientID}`, updatedClient);
      fetchClients();
      closeModal();
    } catch (err) {
      console.error("Failed to update client:", err);
    }
  };

  const handleAdd = async () => {
    await fetchClients();
  };

  const handleRemove = async (clientID) => {
    const confirmed = window.confirm("Are you sure you want to remove this client?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/orders/clients/${clientID}`);
        fetchClients();
      } catch (err) {
        console.error("Failed to delete client:", err);
      }
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
          className="border p-2 rounded bg-white text-gray-800 w-[400px]"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => openModal(null, 'add')}
        >
          + Add New Client
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-gray-800 text-sm text-center">
        <thead className="bg-gray-200">
          <tr className="text-center">
            <th className="border p-2 cursor-pointer text-center" onClick={() => toggleSort('clientID')}>Client ID</th>
            <th className="border p-2 cursor-pointer text-center" onClick={() => toggleSort('name')}>Company Name</th>
            <th className="border p-2 cursor-pointer text-center" onClick={() => toggleSort('licenseNo')}>License No.</th>
            <th className="border p-2 cursor-pointer text-center" onClick={() => toggleSort('address')}>Address</th>
            <th className="border p-2 cursor-pointer text-center" onClick={() => toggleSort('contactPerson')}>Contact Person</th>
            <th className="border p-2 cursor-pointer text-center" onClick={() => toggleSort('contactNumber')}>Contact No.</th>
            <th className="border p-2 cursor-pointer text-center" onClick={() => toggleSort('email')}>Email</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedClients.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-gray-500 py-4">No clients found.</td>
            </tr>
          ) : (
            paginatedClients.map((client, index) => (
              <tr key={`${client.clientID}-${index}`} className="hover:bg-gray-50 text-center">
                <td className="border p-2 text-center">{client.clientID}</td>
                <td className="border p-2 text-center">{client.name}</td>
                <td className="border p-2 text-center">{client.licenseNo}</td>
                <td className="border p-2 text-center">{client.address || '—'}</td>
                <td className="border p-2 text-center">{client.contactPerson}</td>
                <td className="border p-2 text-center">{client.contactNumber}</td>
                <td className="border p-2 text-center">{client.email}</td>
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
            ))
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

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
