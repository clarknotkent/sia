//src/private/Purchasing/Modals/EditReceivingLogModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/';

const EditReceivingLogModal = ({ log, onSave, onClose }) => {
  const [form, setForm] = useState({
    logID: '',
    poID: '',
    supplierName: '',
    dateReceived: '',
    items: [],
    status: ''
  });

  // initialize form from incoming log
  useEffect(() => {
    if (!log) return;
    setForm({
      logID: log.logID,
      poID: log.poID,
      supplierName: log.supplierName,
      dateReceived: log.dateReceived,
      items: log.items.map(i => ({ name: i.name, quantity: i.quantity })),
      status: log.status || ''
    });
  }, [log]);

  const handleDateChange = e => {
    setForm(f => ({ ...f, dateReceived: e.target.value }));
  };

  const handleQtyChange = (idx, value) => {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], quantity: Math.max(1, parseInt(value, 10) || 0) };
      return { ...f, items };
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submit = async () => {
    // basic validation
    if (!form.dateReceived || form.items.some(i => i.quantity <= 0)) {
      return alert('Please enter a valid date and quantities > 0.');
    }
    try {
      await axios.put(`${API}/purchasing/receivingLogs/${form.logID}`, form);
      onSave(form);
    } catch (error) {
      console.error('Error saving receiving log:', error);
      alert('Failed to save receiving log.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-auto max-h-[90vh] text-gray-900">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-900">Edit Receiving Log</h2>

        <table className="w-full text-sm border border-gray-300 mb-4 text-gray-900">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Log ID</td>
              <td className="border px-4 py-2">
                <input
                  readOnly
                  value={form.logID}
                  className="w-full border px-2 py-1 bg-gray-100 text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">PO Number</td>
              <td className="border px-4 py-2">
                <input
                  readOnly
                  value={form.poID}
                  className="w-full border px-2 py-1 bg-gray-100 text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Supplier</td>
              <td className="border px-4 py-2">
                <input
                  readOnly
                  value={form.supplierName}
                  className="w-full border px-2 py-1 bg-gray-100 text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Date Received</td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  value={form.dateReceived}
                  onChange={handleDateChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
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
                    onChange={e => handleQtyChange(idx, e.target.value)}
                    className="w-full border px-1 py-1 bg-white text-gray-900"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end space-x-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={submit}
          >
            Save
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

EditReceivingLogModal.propTypes = {
  log: PropTypes.shape({
    logID: PropTypes.string.isRequired,
    poID: PropTypes.string.isRequired,
    supplierName: PropTypes.string.isRequired,
    dateReceived: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    status: PropTypes.string
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditReceivingLogModal;
