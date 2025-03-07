//src/private/Purchasing/Modals/AddPurchaseOrderModal.jsx
import React, { useState } from 'react';

const AddPurchaseOrderModal = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        poNumber: '',
        supplierName: '',
        orderDate: '',
        totalAmount: '',
        status: 'Pending',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onAdd({
            ...formData,
            totalAmount: parseFloat(formData.totalAmount) || 0,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Purchase Order</h2>
                <input className="border p-2 w-full mb-2 bg-white text-gray-800" name="poNumber" placeholder="PO Number" onChange={handleChange} />
                <input className="border p-2 w-full mb-2 bg-white text-gray-800" name="supplierName" placeholder="Supplier Name" onChange={handleChange} />
                <input className="border p-2 w-full mb-2 bg-white text-gray-800" type="date" name="orderDate" onChange={handleChange} />
                <input className="border p-2 w-full mb-2 bg-white text-gray-800" name="totalAmount" placeholder="Total Amount" onChange={handleChange} />
                <select className="border p-2 w-full mb-4 bg-white text-gray-800" name="status" onChange={handleChange}>

                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <div className="flex justify-end gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Add</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddPurchaseOrderModal;