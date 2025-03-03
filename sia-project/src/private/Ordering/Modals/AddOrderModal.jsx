// src/private/Ordering/Modals/AddOrderModal.jsx

import React, { useState } from 'react';

const AddOrderModal = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        orderID: '',
        clientName: '',
        orderDate: '',
        totalAmount: '',
        remainingBalance: '',
        status: 'Pending',  // Default status
        employee: '',
        quotationID: '', // Optional
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const requiredFields = ['orderID', 'clientName', 'orderDate', 'totalAmount', 'remainingBalance', 'employee'];

        const hasEmptyField = requiredFields.some(field => !formData[field].trim());
        if (hasEmptyField) {
            alert('Please fill in all required fields');
            return;
        }

        const newOrder = {
            ...formData,
            totalAmount: parseFloat(formData.totalAmount),
            remainingBalance: parseFloat(formData.remainingBalance),
            quotationID: formData.quotationID.trim() === '' ? null : formData.quotationID
        };

        onAdd(newOrder);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Create New Order</h2>
                <div className="space-y-2">
                    <input type="text" name="orderID" placeholder="Order ID" value={formData.orderID} onChange={handleChange}
                           className="w-full p-2 border rounded bg-white text-gray-800" />
                    <input type="text" name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleChange}
                           className="w-full p-2 border rounded bg-white text-gray-800" />
                    <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange}
                           className="w-full p-2 border rounded bg-white text-gray-800" />
                    <input type="number" name="totalAmount" placeholder="Total Amount" value={formData.totalAmount} onChange={handleChange}
                           className="w-full p-2 border rounded bg-white text-gray-800" />
                    <input type="number" name="remainingBalance" placeholder="Remaining Balance" value={formData.remainingBalance} onChange={handleChange}
                           className="w-full p-2 border rounded bg-white text-gray-800" />
                    <select name="status" value={formData.status} onChange={handleChange}
                            className="w-full p-2 border rounded bg-white text-gray-800">
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <input type="text" name="employee" placeholder="Employee In-Charge" value={formData.employee} onChange={handleChange}
                           className="w-full p-2 border rounded bg-white text-gray-800" />
                    <input type="text" name="quotationID" placeholder="Quotation Reference (Optional)" value={formData.quotationID} onChange={handleChange}
                           className="w-full p-2 border rounded bg-white text-gray-800" />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddOrderModal;
