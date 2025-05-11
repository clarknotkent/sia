// src/private/Ordering/Modals/ViewOrderModal.jsx
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewOrderModal = ({ order, onClose, refreshParent }) => {
  const printRef = useRef();
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    orderID, orderDate, status, totalAmount,
    remainingBalance, quotationID, client, items = [],
    deliveryStatus
  } = order;

  const formattedDate = orderDate ? (() => {
    const d = new Date(orderDate);
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()} – ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  })() : '';

  const handlePrint = () => {
    const html = printRef.current.innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
          h1, h2, h3 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
        </style>
      </head><body>${html}</body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const handleSendToDelivery = async () => {
    try {
      await axios.put(`${API_BASE_URL}/orders/orders/${orderID}/mark-delivered`);
      alert("Order marked as ready for delivery.");
      if (refreshParent) refreshParent(); // ✅ Safely call refreshParent if it exists
      onClose(); // Close modal
    } catch (err) {
      console.error("Failed to mark as delivered:", err);
      alert(err.response?.data?.error || "Error marking delivery.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl text-gray-800">
        <div ref={printRef}>
          <h1 className="text-2xl font-bold text-center mb-1">Health Key Pharma</h1>
          <h2 className="text-xl text-center mb-4">Order Invoice</h2>

          <div className="text-gray-800 text-sm mb-4 space-y-1">
            <p><strong>Order ID:</strong> {orderID}</p>
            <p><strong>Date:</strong> {formattedDate}</p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Total Amount:</strong> ₱{totalAmount?.toLocaleString()}</p>
            <p><strong>Remaining Balance:</strong> ₱{remainingBalance?.toLocaleString()}</p>
            <p><strong>Quotation Ref:</strong> {quotationID || '—'}</p>
            <p><strong>Delivery Status:</strong> {deliveryStatus || 'Not Sent'}</p>
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mt-4">Client Information</h3>
          <div className="text-gray-800 text-sm mb-4 space-y-1">
            <p><strong>Company Name:</strong> {client?.name}</p>
            <p><strong>License No.:</strong> {client?.licenseNo}</p>
            <p><strong>Contact Person:</strong> {client?.contactPerson}</p>
            <p><strong>Contact Number:</strong> {client?.contactNumber}</p>
            <p><strong>Email:</strong> {client?.email}</p>
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mt-4">Ordered Items</h3>
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
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2 text-right">{item.quantity}</td>
                  <td className="border p-2 text-right">₱{item.unitPrice.toFixed(2)}</td>
                  <td className="border p-2 text-right">₱{(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {status === 'For Delivery' && deliveryStatus !== 'Sent' && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowConfirm(true)}
            >
              Send to Delivery
            </button>
          )}
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={handlePrint}>
            Print Invoice
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={onClose}>
            Close
          </button>
        </div>

        {showConfirm && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center space-y-4">
              <h3 className="text-lg font-bold">Send to Delivery?</h3>
              <p>This will forward the order for delivery processing.</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={handleSendToDelivery}
                >
                  Yes, Send
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ViewOrderModal.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshParent: PropTypes.func, // ✅ Optional prop
};

export default ViewOrderModal;
