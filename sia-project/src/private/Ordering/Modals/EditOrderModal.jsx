// src/private/Ordering/Modals/EditOrderModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditOrderModal = ({ order, onSave, onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formData, setFormData] = useState({ ...order });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/inventory`)
      .then(res => setInventoryItems(res.data))
      .catch(err => console.error("Failed to fetch inventory:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = field === 'quantity' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = (productId) => {
    const selected = inventoryItems.find(p => p.id === productId);
    if (!selected) return;
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { name: selected.genericName, quantity: 0, unitPrice: selected.price }
      ]
    }));
  };

  const removeItem = (index) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, items: updated }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      orderDate: order.orderDate // 🛠 Retain original timestamp!
    };
    try {
      await axios.put(`${API_BASE_URL}/orders/orders/${order.orderID}`, payload);
      onSave(payload);
      onClose();
    } catch (err) {
      console.error("Failed to save order:", err);
      alert("Could not save order. " + (err.response?.data?.error || err.message));
    }
  };

  const selectedProductNames = formData.items.map(i => i.name);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] text-gray-800">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Order</h2>

        <table className="w-full border mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Order Date</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={new Date(order.orderDate).toLocaleString()}
                  readOnly
                  className="w-full p-2 border rounded bg-white text-black cursor-not-allowed"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Remaining Balance</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  name="remainingBalance"
                  value={formData.remainingBalance}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white text-black"
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
                  className="w-full p-2 border rounded bg-white text-black"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="For Delivery">For Delivery</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-md font-semibold text-gray-700 mb-2">Client Information</h3>
        <table className="w-full border text-sm mb-4">
          <tbody>
            <tr><td className="border px-4 py-2 font-medium">Name</td><td className="border px-4 py-2">{formData.client?.name}</td></tr>
            <tr><td className="border px-4 py-2 font-medium">License No.</td><td className="border px-4 py-2">{formData.client?.licenseNo}</td></tr>
            <tr><td className="border px-4 py-2 font-medium">Contact Person</td><td className="border px-4 py-2">{formData.client?.contactPerson}</td></tr>
            <tr><td className="border px-4 py-2 font-medium">Contact Number</td><td className="border px-4 py-2">{formData.client?.contactNumber}</td></tr>
            <tr><td className="border px-4 py-2 font-medium">Email</td><td className="border px-4 py-2">{formData.client?.email}</td></tr>
          </tbody>
        </table>

        <h3 className="text-md font-semibold text-gray-700 mb-2">Order Items</h3>
        <div className="space-y-2 mb-4">
          {formData.items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 items-center">
              <input readOnly value={item.name} className="p-2 border rounded bg-white text-black" />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                className="p-2 border rounded bg-white text-black"
              />
              <input readOnly value={`₱${item.unitPrice}`} className="p-2 border rounded bg-white text-black" />
              <button onClick={() => removeItem(idx)} className="bg-red-500 text-white px-3 py-1 rounded">
                Remove
              </button>
            </div>
          ))}
          <select
            className="p-2 border rounded w-full bg-white text-black"
            onChange={(e) => { if (e.target.value) addItem(e.target.value); e.target.value = ''; }}
          >
            <option value="">+ Add Product</option>
            {inventoryItems
              .filter(p => !selectedProductNames.includes(p.genericName))
              .map(p => (
                <option key={p.id} value={p.id}>{p.genericName}</option>
              ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

EditOrderModal.propTypes = {
  order: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditOrderModal;
