// src/private/Purchasing/Modals/EditPurchaseOrderModal.jsx
import React, { useState, useEffect } from 'react';

const EditPurchaseOrderModal = ({ po, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    poID: '',
    supplier: '',
    orderDate: '',
    status: '',
    items: [],
  });

  const suppliers = ['MediSupply Co.', 'PharmaDirect', 'HealthSource', 'Wellness Depot'];

  useEffect(() => {
    if (po) {
      setFormData({
        poID: po.poID,
        supplier: po.supplier,
        orderDate: po.orderDate,
        status: po.status,
        items: po.items || [],
      });
    }
  }, [po]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index, e) => {
    const updatedItems = [...formData.items];
    updatedItems[index][e.target.name] = e.target.name === 'name' ? e.target.value : parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const handleSubmit = () => {
    const totalAmount = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    onSave({ ...formData, totalAmount });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Purchase Order</h2>

        <input
          className="border p-2 w-full mb-2 bg-white text-gray-800"
          name="poID"
          value={formData.poID}
          disabled
        />

        <select
          className="border p-2 w-full mb-2 bg-white text-gray-800"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s, index) => (
            <option key={index} value={s}>{s}</option>
          ))}
        </select>

        <input
          type="date"
          name="orderDate"
          value={formData.orderDate}
          onChange={handleChange}
          className="border p-2 w-full mb-2 bg-white text-gray-800"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 w-full mb-4 bg-white text-gray-800"
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Received">Received</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                name="name"
                value={item.name}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Item Name"
                className="border p-2 flex-1 bg-white text-gray-800"
              />
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Qty"
                className="border p-2 w-20 bg-white text-gray-800"
              />
              <input
                type="number"
                name="unitPrice"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Unit Price"
                className="border p-2 w-24 bg-white text-gray-800"
              />
            </div>
          ))}
          <button
            onClick={addItem}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Add Item
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPurchaseOrderModal;
