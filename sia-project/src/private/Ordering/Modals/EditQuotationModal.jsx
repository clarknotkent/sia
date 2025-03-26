// src/private/Ordering/Modals/EditQuotationModal.jsx

import React, { useState } from 'react';

const EditQuotationModal = ({ quotation, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...quotation });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = field === 'quantity' || field === 'unitPrice' ? parseFloat(value) : value;
        setFormData({ ...formData, items: updatedItems });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { name: '', quantity: 0, unitPrice: 0 }]
        }));
    };

    const removeItem = (index) => {
        const updated = [...formData.items];
        updated.splice(index, 1);
        setFormData({ ...formData, items: updated });
    };

    const handleSubmit = () => {
        const totalAmount = formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        onSave({ ...formData, totalAmount });
        onClose();
    };

    const { client } = formData;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Quotation</h2>

                {/* Date & Status */}
                <input
                    type="date"
                    name="quotationDate"
                    value={formData.quotationDate}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded bg-white text-gray-800"
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded bg-white text-gray-800"
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                {/* Client Info (Read-only) */}
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Client Info</h3>
                <div className="grid grid-cols-1 gap-2 mb-4 text-sm text-gray-800">
                    <input readOnly value={client?.name} className="w-full p-2 border rounded bg-gray-100" placeholder="Client Name" />
                    <input readOnly value={client?.licenseNo} className="w-full p-2 border rounded bg-gray-100" placeholder="License No." />
                    <input readOnly value={client?.contactPerson} className="w-full p-2 border rounded bg-gray-100" placeholder="Contact Person" />
                    <input readOnly value={client?.contactNumber} className="w-full p-2 border rounded bg-gray-100" placeholder="Contact Number" />
                    <input readOnly value={client?.email} className="w-full p-2 border rounded bg-gray-100" placeholder="Email" />
                </div>

                {/* Quoted Items */}
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Quoted Items</h3>
                <div className="space-y-2 mb-4">
                    {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={item.name}
                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                className="p-2 border rounded bg-white text-gray-800"
                            />
                            <input
                                type="number"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                className="p-2 border rounded bg-white text-gray-800"
                            />
                            <input
                                type="number"
                                placeholder="Unit Price"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                className="p-2 border rounded bg-white text-gray-800"
                            />
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => removeItem(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
                        onClick={addItem}
                    >
                        + Add Item
                    </button>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditQuotationModal;