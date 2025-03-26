// src/private/Ordering/Modals/EditOrderModal.jsx

import React, { useState } from 'react';

const EditOrderModal = ({ order, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...order });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = field === 'quantity' || field === 'unitPrice' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, items: updatedItems }));
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

    const { client, orderDate, remainingBalance, status, employee, quotationID } = formData;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Order</h2>

                {/* Order Info */}
                <input
                    type="date"
                    name="orderDate"
                    value={orderDate}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded bg-white text-gray-800"
                />

                <input
                    type="number"
                    name="remainingBalance"
                    value={remainingBalance}
                    onChange={handleChange}
                    placeholder="Remaining Balance"
                    className="w-full mb-2 p-2 border rounded bg-white text-gray-800"
                />

                <input
                    name="employee"
                    placeholder="Employee"
                    value={employee}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded bg-white text-gray-800"
                />

                <select
                    name="status"
                    value={status}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded bg-white text-gray-800"
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                {/* Client Info (readonly) */}
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Client Info</h3>
                <div className="grid grid-cols-1 gap-2 text-sm mb-4 text-gray-800">
                    <input readOnly value={client?.name} className="w-full p-2 border rounded bg-gray-100" placeholder="Client Name" />
                    <input readOnly value={client?.licenseNo} className="w-full p-2 border rounded bg-gray-100" placeholder="License No." />
                    <input readOnly value={client?.contactPerson} className="w-full p-2 border rounded bg-gray-100" placeholder="Contact Person" />
                    <input readOnly value={client?.contactNumber} className="w-full p-2 border rounded bg-gray-100" placeholder="Contact Number" />
                    <input readOnly value={client?.email} className="w-full p-2 border rounded bg-gray-100" placeholder="Email" />
                </div>

                {/* Items Section */}
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ordered Items</h3>
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
                <div className="flex justify-end space-x-2 mt-6">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditOrderModal;
