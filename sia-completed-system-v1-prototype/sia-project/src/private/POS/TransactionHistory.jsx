// src/private/POS/TransactionHistory.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const TransactionHistory = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    axios
      .get("/api/pos/history")
      .then((res) => {
        if (res.data && Array.isArray(res.data.history)) {
          setLogs(res.data.history);
          setFilteredLogs(res.data.history);
        } else {
          throw new Error("Invalid response format");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch transaction history:", err);
        setError("Unable to load transaction history.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = logs.filter((tx) => {
      const matchesSearch = tx.orderId.toLowerCase().includes(lowerSearch);
      const matchesPayment = paymentFilter ? tx.paymentMethod === paymentFilter : true;
      return matchesSearch && matchesPayment;
    });
    setFilteredLogs(filtered);
  }, [search, paymentFilter, logs]);

  const handleDelete = async (orderId) => {
    console.log("Deleting order:", orderId); // Debugging
    if (confirm(`Are you sure you want to delete Order #${orderId}?`)) {
      try {
        await axios.delete(`/api/pos/history/${orderId}`);
        setLogs((prev) => prev.filter((tx) => tx.orderId !== orderId));
        alert(`Order #${orderId} deleted successfully.`);
      } catch (err) {
        console.error(`Failed to delete Order #${orderId}:`, err);
        alert(`Failed to delete Order #${orderId}. Please try again.`);
      }
    }
  };

  const formatDate = (rawDate) => {
    const d = new Date(rawDate);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${mm}-${dd}-${yyyy} – ${hh}:${min}`;
  };

  if (loading) return <p>Loading transaction history…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-auto">
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Payments</option>
          <option value="Cash">Cash</option>
          <option value="E-wallet">E-wallet</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2 border">Order #</th>
            <th className="px-3 py-2 border">Date</th>
            <th className="px-3 py-2 border">Items</th>
            <th className="px-3 py-2 border">Total</th>
            <th className="px-3 py-2 border">Payment</th>
            <th className="px-3 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((tx) => (
            <tr key={tx.orderId}>
              <td className="px-3 py-2 border">{tx.orderId}</td>
              <td className="px-3 py-2 border">{formatDate(tx.date)}</td>
              <td className="px-3 py-2 border">{tx.items?.length || 0}</td>
              <td className="px-3 py-2 border">₱{(tx.totalAmount || 0).toFixed(2)}</td>
              <td className="px-3 py-2 border">{tx.paymentMethod || "N/A"}</td>
              <td className="px-3 py-2 border space-x-2">
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  View
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(tx.orderId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div>
              <h1 className="text-2xl font-bold text-center mb-1">Health Key Pharma</h1>
              <h2 className="text-xl text-center mb-4">Transaction Receipt</h2>

              <div className="text-gray-800 text-sm mb-4 space-y-1">
                <p><strong>Order ID:</strong> {selectedTransaction.orderId}</p>
                <p><strong>Date:</strong> {formatDate(selectedTransaction.date)}</p>
                <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
                <p><strong>Total:</strong> ₱{(selectedTransaction.totalAmount || 0).toFixed(2)}</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mt-4">Items</h3>
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
                  {selectedTransaction.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{item.genericName}</td>
                      <td className="border p-2 text-right">{item.quantity}</td>
                      <td className="border p-2 text-right">₱{item.price.toFixed(2)}</td>
                      <td className="border p-2 text-right">₱{(item.price * item.quantity * (1 - (item.discount || 0) / 100)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4 space-x-2 no-print">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => window.print()}
              >
                Print
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TransactionHistory.propTypes = {
  onViewReceipt: PropTypes.func,
};

export default TransactionHistory;
