// src/private/Ordering/OrderTable.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ViewOrderModal from './Modals/ViewOrderModal';
import EditOrderModal from './Modals/EditOrderModal';
import ViewQuotationModal from './Modals/ViewQuotationModal';
import Pagination from '../../components/Pagination';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [approvedQuotations, setApprovedQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const pageSize = 5;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchQuotations = async () => {
    try {
      const [quotationRes, orderRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders/quotations`),
        axios.get(`${API_BASE_URL}/orders/orders`)
      ]);
      const usedQuotationIds = orderRes.data.map(o => o.quotationID);
      const approved = quotationRes.data.filter(q =>
        q.status === 'Approved' && !usedQuotationIds.includes(q.quotationID)
      );
      setApprovedQuotations(approved);
    } catch (err) {
      console.error("Error fetching quotations/orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchQuotations();
  }, []);

  const handleCancel = async (orderID) => {
    const confirmed = window.confirm("Are you sure you want to remove this order?");
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/orders/orders/${orderID}`);
        fetchOrders();
      } catch (err) {
        console.error("Failed to cancel order:", err);
      }
    }
  };

  const handleConvert = async () => {
    if (!selectedQuotation) return;
    try {
      await axios.post(`${API_BASE_URL}/quotations/${selectedQuotation.quotationID}/convert`);
      fetchOrders();
      fetchQuotations();
      setShowQuotationModal(false);
      setSelectedQuotation(null);
    } catch (err) {
      console.error("Failed to convert quotation:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to convert quotation. Please try again.");
    }
  };

  const handleSave = async (updatedOrder) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/orders/${updatedOrder.orderID}`, updatedOrder);
      fetchOrders();
    } catch (err) {
      console.error("Failed to save order:", err);
    }
    closeModal();
  };

  const openModal = (order, type) => {
    setSelectedOrder(order);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalType(null);
  };

  const toggleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const filteredOrders = orders.filter(order =>
    (order.orderID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? order.status === statusFilter : true)
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    return aValue < bValue ? (sortOrder === 'asc' ? -1 : 1)
      : aValue > bValue ? (sortOrder === 'asc' ? 1 : -1)
        : 0;
  });

  const paginatedOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(sortedOrders.length / pageSize);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Orders</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by Order ID or Client Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded bg-white text-gray-800 w-[400px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="For Delivery">For Delivery</option>
            <option value="Refunded">Refunded</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setShowQuotationModal(true)}
        >
          Convert from Quotation
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('orderID')}>Order ID</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Order Date</th>
            <th className="border p-2 text-right">Total</th>
            <th className="border p-2 text-right">Remaining</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Delivery</th>
            <th className="border p-2">Quotation</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map(order => (
            <tr key={order.orderID} className="hover:bg-gray-100">
              <td className="border p-2">{order.orderID}</td>
              <td className="border p-2">{order.client?.name}</td>
              <td className="border p-2">
                {order.orderDate ? (() => {
                  const d = new Date(order.orderDate);
                  const mm = String(d.getMonth() + 1).padStart(2, '0');
                  const dd = String(d.getDate()).padStart(2, '0');
                  const yyyy = d.getFullYear();
                  const hh = String(d.getHours()).padStart(2, '0');
                  const min = String(d.getMinutes()).padStart(2, '0');
                  return `${mm}-${dd}-${yyyy} | ${hh}:${min}`;
                })() : ''}
              </td>
              <td className="border p-2 text-right">₱{order.totalAmount?.toLocaleString() || '0.00'}</td>
              <td className="border p-2 text-right">₱{order.remainingBalance?.toLocaleString() || '0.00'}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2 text-center">
                {order.deliveryStatus === 'Sent' ? (
                  <span className="text-green-600 font-semibold">Sent</span>
                ) : (
                  <span className="text-yellow-600 font-medium">Not Sent</span>
                )}
              </td>
              <td className="border p-2">{order.quotationID || '—'}</td>
              <td className="border p-2 text-center space-x-1">
                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => openModal(order, 'view')}>View</button>
                <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  onClick={() => openModal(order, 'edit')}>Edit</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  onClick={() => handleCancel(order.orderID)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {modalType === 'view' && selectedOrder && (
        <ViewOrderModal order={selectedOrder} onClose={closeModal} />
      )}
      {modalType === 'edit' && selectedOrder && (
        <EditOrderModal order={selectedOrder} onSave={handleSave} onClose={closeModal} />
      )}

      {showQuotationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Select Quotation to Convert</h3>
            {approvedQuotations.length === 0 ? (
              <p className="text-gray-500">No approved quotations available.</p>
            ) : (
              <table className="w-full text-sm text-gray-800 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Quotation ID</th>
                    <th className="border p-2">Client</th>
                    <th className="border p-2 text-right">Total</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedQuotations.map(q => (
                    <tr key={q.quotationID} className="hover:bg-gray-50">
                      <td className="border p-2">{q.quotationID}</td>
                      <td className="border p-2">{q.client?.name}</td>
                      <td className="border p-2 text-right">₱{q.totalAmount?.toLocaleString()}</td>
                      <td className="border p-2 text-center">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => setSelectedQuotation(q)}
                        >
                          View Quotation
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => {
                  setShowQuotationModal(false);
                  setSelectedQuotation(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedQuotation && showQuotationModal && (
        <ViewQuotationModal
          quotation={selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
          onConvert={handleConvert}
        />
      )}
    </div>
  );
};

export default OrderTable;
