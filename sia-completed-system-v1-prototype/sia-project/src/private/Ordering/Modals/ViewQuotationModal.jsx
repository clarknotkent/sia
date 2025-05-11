// src/private/Ordering/Modals/ViewQuotationModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ViewQuotationModal = ({ quotation, onClose, fetchQuotations }) => {
  const [isConverting, setIsConverting] = useState(false);
  const { quotationID, quotationDate, status, client, items, totalAmount } = quotation;
  const isApproved = status === 'Approved';

  const handleConvertToOrder = async () => {
    if (!quotationID) {
      alert("Invalid quotation selected.");
      return;
    }

    setIsConverting(true);
    try {
      // Updated endpoint to match the backend route
      await axios.post(`${API_BASE_URL}/orders/quotations/${quotationID}/convert`);
      alert("Quotation converted to Order successfully!");
      fetchQuotations?.(); // Refetch quotations if the function is provided
      onClose();
    } catch (error) {
      console.error("Failed to convert quotation:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to convert quotation. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const formatDateTime = (rawDate) => {
    const d = new Date(rawDate);
    if (isNaN(d)) return rawDate; // fallback if it's already preformatted
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${mm}-${dd}-${yyyy} | ${hh}:${min}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Quotation Details</h2>
        <p><strong>ID:</strong> {quotationID}</p>
        <p><strong>Date:</strong> {quotationDate ? formatDateTime(quotationDate) : ''}</p>
        <p><strong>Status:</strong> {status}</p>

        <h3 className="mt-4 text-lg font-semibold">Client</h3>
        <p><strong>Name:</strong> {client?.name}</p>
        <p><strong>Contact:</strong> {client?.contactPerson} | {client?.contactNumber}</p>
        <p><strong>Email:</strong> {client?.email}</p>

        <h3 className="mt-4 text-lg font-semibold text-gray-700">Items</h3>
        <table className="w-full text-sm border border-gray-300 mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-right">Qty</th>
              <th className="border p-2 text-right">Unit Price</th>
              <th className="border p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">₱{Number(item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="border p-2 text-right">₱{(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 font-bold text-right">Total: ₱{totalAmount?.toLocaleString()}</p>

        <div className="flex justify-end mt-6 gap-2">
          {isApproved && (
            <button
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${isConverting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleConvertToOrder}
              disabled={isConverting}
            >
              {isConverting ? 'Converting...' : 'Convert to Order'}
            </button>
          )}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewQuotationModal.propTypes = {
  quotation: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchQuotations: PropTypes.func,
};

export default ViewQuotationModal;
