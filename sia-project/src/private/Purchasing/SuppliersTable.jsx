// src/private/Purchasing/SuppliersTable.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ViewSupplierModal from './Modals/ViewSupplierModal';
import EditSupplierModal from './Modals/EditSupplierModal';
import AddSupplierModal from './Modals/AddSupplierModal';
import Pagination from '../../components/Pagination';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SuppliersTable = () => {
  const [suppliers, setSuppliers]         = useState([]);
  const [currentPage, setCurrentPage]     = useState(1);
  const pageSize                           = 5;
  const [searchTerm, setSearchTerm]       = useState('');
  const [sortColumn, setSortColumn]       = useState(null);
  const [sortOrder, setSortOrder]         = useState('asc');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [modalType, setModalType]         = useState(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/purchasing/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const filteredSuppliers = suppliers.filter(s =>
    (s.supplierID?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortOrder === 'asc' ? -1: 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1: -1;
    return 0;
  });

  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(sortedSuppliers.length / pageSize);

  const openModal = (supplier, type) => {
    setSelectedSupplier(supplier);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
    setModalType(null);
  };

  const handleSave = async (updatedSupplier) => {
    try {
      await axios.put(
        `${API}/purchasing/suppliers/${updatedSupplier.supplierID}`,
        updatedSupplier
      );
      fetchSuppliers();
      closeModal();
    } catch (err) {
      console.error("Failed to update supplier:", err);
    }
  };

  const handleAdd = async (formData) => {
    try {
      await axios.post(`${API}/purchasing/suppliers`, formData);
      fetchSuppliers();
      closeModal();
    } catch (err) {
      console.error("Failed to add supplier:", err);
    }
  };

  const handleRemove = async (supplierID) => {
    if (!window.confirm("Are you sure you want to remove this supplier?")) return;
    try {
      await axios.delete(`${API}/purchasing/suppliers/${supplierID}`);
      fetchSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier:", err);
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
      <h2 className="text-xl font-bold text-gray-800 mb-4">Registered Suppliers</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded bg-white text-gray-800 w-[400px]"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => openModal(null, 'add')}
        >
          + Add New Supplier
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-gray-800 text-sm text-center">
        <thead className="bg-gray-200">
          <tr>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => toggleSort('supplierID')}
            >
              Supplier ID
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => toggleSort('name')}
            >
              Name
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => toggleSort('contactPerson')}
            >
              Contact Person
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => toggleSort('contactNumber')}
            >
              Contact No.
            </th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSuppliers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4">
                No suppliers found.
              </td>
            </tr>
          ) : (
            paginatedSuppliers.map((s, idx) => (
              <tr key={`${s.supplierID}-${idx}`} className="hover:bg-gray-50">
                <td className="border p-2">{s.supplierID}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.contactPerson}</td>
                <td className="border p-2">{s.contactNumber}</td>
                <td className="border p-2 space-x-1">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => openModal(s, 'view')}
                  >
                    View
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    onClick={() => openModal(s, 'edit')}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => handleRemove(s.supplierID)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {modalType === 'view' && selectedSupplier && (
        <ViewSupplierModal supplier={selectedSupplier} onClose={closeModal} />
      )}
      {modalType === 'edit' && selectedSupplier && (
        <EditSupplierModal
          supplier={selectedSupplier}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      {modalType === 'add' && (
        <AddSupplierModal onAdd={handleAdd} onClose={closeModal} />
      )}
    </div>
  );
};

export default SuppliersTable;
