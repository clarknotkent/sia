import React, { useState } from 'react';

const EditPurchaseOrderModal = ({ order, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...order });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave({
            ...formData,
            totalAmount: parseFloat(formData.totalAmount) || 0,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Purchase Order</h2>
                <input className="border p-2 w-full mb-2" name="poNumber" value={formData.poNumber} disabled />
                <input className="border p-2 w-full mb-2" name="supplierName" value={formData.supplierName} onChange={handleChange} />
                <input className="border p-2 w-full mb-2" type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} />
                <input className="border p-2 w-full mb-2" name="totalAmount" value={formData.totalAmount} onChange={handleChange} />
                <select className="border p-2 w-full mb-4" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <div className="flex justify-end gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditPurchaseOrderModal;
