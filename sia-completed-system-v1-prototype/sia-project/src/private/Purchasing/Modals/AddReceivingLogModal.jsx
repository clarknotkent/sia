// src/private/Purchasing/Modals/AddReceivingLogModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AddReceivingLogModal = ({ onAdd, onClose }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [form, setForm] = useState({
    logID: '',
    poID: '',
    supplierName: '',
    dateReceived: '',
    items: [],  // will become [{ name, quantity }]
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = `RL-${Math.floor(1000 + Math.random()*9000)}`;
    setForm(f => ({ ...f, logID: id }));
    axios.get(`${API}/purchasing/purchaseOrders`)
      .then(res => setPurchaseOrders(res.data))
      .catch(() => setError('Failed to load POs'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get(`${API}/purchasing/receivingLogs`);
  }, []);

  useEffect(() => {
    if (!form.poID) return;
    const po = purchaseOrders.find(p => p.poID === form.poID);
    if (po) {
      setForm(f => ({
        ...f,
        supplierName: po.supplierName || po.supplierID,
        items: po.items.map(it => ({ name: it.name, quantity: 0 }))
      }));
    }
  }, [form.poID, purchaseOrders]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleQty = (idx, val) => {
    setForm(f => {
      const items = [...f.items];
      items[idx].quantity = parseInt(val,10) || 0;
      return { ...f, items };
    });
  };

  const handleSubmit = async () => {
    const { logID, poID, supplierName, dateReceived, items, status } = form;
    if (!poID || !supplierName || !dateReceived || !status || items.length === 0) {
      alert('All fields including status are required.');
      return;
    }

    try {
      const formData = { logID, poID, supplierName, dateReceived, items, status };
      const resp = await axios.post(
        `${API}/purchasing/receivingLogs`,
        formData
      );
      onAdd(resp.data);
      onClose();
    } catch (err) {
      console.error('Add receiving log error:', err);
      alert('Failed to add receiving log.');
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow">Loading…</div>
    </div>
  );
  if (error) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-auto max-h-[90vh] text-gray-900">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-900">Add to Receiving Logs</h2>

        <table className="w-full text-sm border border-gray-300 mb-4 text-gray-900">
          <tbody>
            <tr>
              <td className="border px-3 py-2 font-medium">Log ID</td>
              <td className="border px-3 py-2">
                <input readOnly value={form.logID}
                  className="w-full border px-2 py-1 bg-gray-100"/>
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2 font-medium">PO Number</td>
              <td className="border px-3 py-2">
                <select
                  name="poID" value={form.poID} onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white"
                >
                  <option value="">Select PO</option>
                  {purchaseOrders.map(po => (
                    <option key={po.poID} value={po.poID}>
                      {po.poID}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2 font-medium">Supplier</td>
              <td className="border px-3 py-2">
                <input readOnly value={form.supplierName}
                  className="w-full border px-2 py-1 bg-gray-100"/>
              </td>
            </tr>
            <tr>
              <td className="border px-3 py-2 font-medium">Date Received</td>
              <td className="border px-3 py-2">
                <input type="date" name="dateReceived" value={form.dateReceived}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white"/>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Status</td>
              <td className="border px-4 py-2">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                >
                  <option>Pending</option>
                  <option>Partial</option>
                  <option>Complete</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold mb-2 text-gray-900">Received Items</h3>
        <table className="table-auto w-full text-sm border border-gray-300 mb-4 text-gray-900 mx-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Product</th>
              <th className="border px-2 py-1 text-right">Qty</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((it, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{it.name}</td>
                <td className="border px-2 py-1 text-right">
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={e => handleQty(idx, e.target.value)}
                    className="w-full border px-1 py-1 text-right bg-white"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

AddReceivingLogModal.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  po: PropTypes.shape({ supplierID: PropTypes.string, items: PropTypes.array }).isRequired,
};

export default AddReceivingLogModal;
