// src/private/Ordering/Modals/EditQuotationModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const formatDate = (iso) => {
  if (!iso || isNaN(Date.parse(iso))) return ''; // Guard against invalid date
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const EditQuotationModal = ({ quotation, onSave, onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formData, setFormData] = useState({
    ...quotation,
    quotationDate: formatDate(quotation.quotationDate),
  });

  useEffect(() => {
    axios.get('/api/inventory').then(res => setInventoryItems(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    if (field === 'quantity') {
      updated[index][field] = parseFloat(value);
    }
    setFormData({ ...formData, items: updated });
  };

  const addItem = (productId) => {
    const selected = inventoryItems.find(p => p.id === productId);
    if (!selected) return;

    const newItem = {
      name: selected.genericName,
      quantity: 0,
      unitPrice: selected.price,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  const handleSubmit = () => {
    const totalAmount = formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    onSave({
      ...formData,
      quotationDate: quotation.quotationDate, // 🛡️ re-assign original date
      totalAmount
    });
    onClose();
  };
  

  const selectedProductNames = formData.items.map(i => i.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] text-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Quotation</h2>

        <table className="w-full border mb-4">
          <tbody>
          <tr>
            <td className="border px-4 py-2 font-medium">Quotation Date</td>
            <td className="border px-4 py-2">
              <input
                type="date"
                name="quotationDate"
                value={formData.quotationDate}
                disabled
                className="w-full p-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </td>
            </tr>

            <tr>
              <td className="border px-4 py-2 font-medium">Status</td>
              <td className="border px-4 py-2">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-md font-semibold text-gray-700 mb-2">Client Information</h3>
        <table className="w-full border text-sm mb-4">
          <tbody>
            <tr><td className="border px-4 py-2 font-medium">Name</td><td className="border px-4 py-2">{formData.client?.name}</td></tr>
            <tr><td className="border px-4 py-2 font-medium">Contact</td><td className="border px-4 py-2">{formData.client?.contactNumber}</td></tr>
            <tr><td className="border px-4 py-2 font-medium">Email</td><td className="border px-4 py-2">{formData.client?.email}</td></tr>
          </tbody>
        </table>

        <h3 className="text-md font-semibold text-gray-700 mb-2">Quotation Items</h3>
        <div className="space-y-2 mb-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 items-center">
              <input
                readOnly
                value={item.name}
                className="p-2 border rounded bg-gray-100"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                readOnly
                value={`₱${item.unitPrice}`}
                className="p-2 border rounded bg-gray-100"
              />
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <select
              className="p-2 border rounded w-full"
              onChange={(e) => {
                if (e.target.value) addItem(e.target.value);
                e.target.value = '';
              }}
            >
              <option value="">+ Add Product</option>
              {inventoryItems
                .filter(p => !selectedProductNames.includes(p.genericName))
                .map(p => (
                  <option key={p.id} value={p.id}>{p.genericName}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

EditQuotationModal.propTypes = {
  quotation: PropTypes.shape({
    quotationDate: PropTypes.string,
    status: PropTypes.string,
    client: PropTypes.shape({
      name: PropTypes.string,
      contactNumber: PropTypes.string,
      email: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        quantity: PropTypes.number,
        unitPrice: PropTypes.number,
      })
    ),
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditQuotationModal;
