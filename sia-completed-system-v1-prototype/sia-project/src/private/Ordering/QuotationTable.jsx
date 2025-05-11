// src/private/Ordering/QuotationTable.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ViewQuotationModal from './Modals/ViewQuotationModal';
import EditQuotationModal from './Modals/EditQuotationModal';
import AddQuotationModal from './Modals/AddQuotationModal';
import Pagination from '../../components/Pagination';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const QuotationTable = () => {
  const [quotations, setQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [modalType, setModalType] = useState(null);
  const pageSize = 5;

  const fetchQuotations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/quotations`);
      setQuotations(res.data);
    } catch (err) {
      console.error("Failed to fetch quotations:", err);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const filtered = quotations.filter(q =>
    (q.quotationID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.client?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? q.status === statusFilter : true)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    return aValue < bValue ? (sortOrder === 'asc' ? -1 : 1) : aValue > bValue ? (sortOrder === 'asc' ? 1 : -1) : 0;
  });

  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

  const openModal = (quotation, type) => {
    setSelectedQuotation(quotation);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedQuotation(null);
    setModalType(null);
  };

  const handleAdd = async (newQuotation) => {
    try {
      await axios.post(`${API_BASE_URL}/orders/quotations`, newQuotation);
      fetchQuotations();
      closeModal();
    } catch (err) {
      console.error("Failed to add quotation:", err);
    }
  };

  const handleSave = async (updatedQuotation) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/quotations/${updatedQuotation.quotationID}`, updatedQuotation);
      fetchQuotations();
      closeModal();
    } catch (err) {
      console.error("Failed to update quotation:", err);
    }
  };

  const handleCancel = async (quotationID) => {
    const confirmed = window.confirm("Are you sure you want to cancel this quotation?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/orders/quotations/${quotationID}`);
        fetchQuotations();
      } catch (err) {
        console.error("Failed to cancel quotation:", err);
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
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quotations</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by ID or Client"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded bg-white text-gray-800 w-[400px]"
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

      <table className="w-full border-collapse border border-gray-300 text-gray-800 text-sm text-center">
        <thead className="bg-gray-200">
          <tr className="text-center">
            <th className="border p-2 cursor-pointer text-center" onClick={() => toggleSort('quotationID')}>Quotation ID</th>
            <th className="border p-2 text-center">Client</th>
            <th className="border p-2 text-center">Date</th>
            <th className="border p-2 text-center">Total</th>
            <th className="border p-2 text-center">Status</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-4">No quotations found.</td>
            </tr>
          ) : (
            paginated.map(q => (
              <tr key={q.quotationID} className="hover:bg-gray-100 text-center">
                <td className="border p-2 text-center">{q.quotationID}</td>
                <td className="border p-2 text-center">{q.client?.name}</td>
                <td className="border p-2 text-center">
                  {q.quotationDate
                    ? (() => {
                        const d = new Date(q.quotationDate);
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        const dd = String(d.getDate()).padStart(2, '0');
                        const yyyy = d.getFullYear();
                        const hh = String(d.getHours()).padStart(2, '0');
                        const min = String(d.getMinutes()).padStart(2, '0');
                        return `${mm}-${dd}-${yyyy} | ${hh}:${min}`;
                      })()
                    : ''}
                </td>
                <td className="border p-2 text-center">₱{q.totalAmount?.toLocaleString()}</td>
                <td
                  className={
                    `border p-2 font-semibold text-center ${
                      q.status === "Pending"
                        ? "text-yellow-600"
                        : q.status === "Approved"
                        ? "text-green-600"
                        : q.status === "Rejected"
                        ? "text-red-600"
                        : q.status === "Converted"
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`
                  }
                >
                  {q.status}
                </td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => openModal(q, 'view')}>View</button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => openModal(q, 'edit')}>Edit</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleCancel(q.quotationID)}>Cancel</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {modalType === 'view' && selectedQuotation && (
        <ViewQuotationModal quotation={selectedQuotation} onClose={closeModal} fetchQuotations={fetchQuotations} />
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
