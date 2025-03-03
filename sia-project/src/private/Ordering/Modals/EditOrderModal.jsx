// src/private/Ordering/Modals/EditOrderModal.jsx

import React, { useState } from 'react';

const EditOrderModal = ({ order, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...order });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Order</h2>
                <input className="border p-2 w-full mb-2 bg-white text-gray-800" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Client Name" />
                <input className="border p-2 w-full mb-2 bg-white text-gray-800" name="orderDate" value={formData.orderDate} onChange={handleChange} placeholder="Order Date" />
                <input className="border p-2 w-full mb-2 bg-white text-gray-800" name="totalAmount" value={formData.totalAmount} onChange={handleChange} placeholder="Total Amount" />
                <select className="border p-2 w-full mb-4 bg-white text-gray-800" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSubmit}>Save</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditOrderModal;