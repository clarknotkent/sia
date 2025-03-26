import React, { useState } from 'react';

const mockClients = [
    {
        clientID: 'C001',
        name: 'ABC Pharmacy',
        licenseNo: 'FDA12345',
        contactPerson: 'Jane Dela Cruz',
        contactNumber: '0917-123-4567',
        email: 'abc@pharmacy.com'
    },
    {
        clientID: 'C002',
        name: 'XYZ Drugstore',
        licenseNo: 'FDA67890',
        contactPerson: 'Mark Santos',
        contactNumber: '0918-456-7890',
        email: 'xyz@drugstore.com'
    }
];

const AddOrderModal = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        orderID: '',
        orderDate: '',
        status: 'Pending',
        remainingBalance: '',
        employee: '',
        quotationID: '',
        client: null,
        items: [{ name: '', quantity: 0, unitPrice: 0 }],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClientSelect = (e) => {
        const selectedClient = mockClients.find(c => c.clientID === e.target.value);
        setFormData(prev => ({ ...prev, client: selectedClient }));
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
        setFormData(prev => ({ ...prev, items: updated }));
    };

    const handleSubmit = () => {
        const { orderID, orderDate, remainingBalance, employee, client, items } = formData;

        if (!orderID || !orderDate || !remainingBalance || !employee || !client) {
            alert('Please fill in all required fields');
            return;
        }

        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

        const newOrder = {
            ...formData,
            totalAmount,
            remainingBalance: parseFloat(remainingBalance),
            quotationID: formData.quotationID.trim() === '' ? null : formData.quotationID,
        };

        onAdd(newOrder);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Order</h2>

                {/* Order Info */}
                <input type="text" name="orderID" placeholder="Order ID" value={formData.orderID}
                    onChange={handleChange} className="w-full mb-2 p-2 border rounded bg-white text-gray-800" />

                <input type="date" name="orderDate" value={formData.orderDate}
                    onChange={handleChange} className="w-full mb-2 p-2 border rounded bg-white text-gray-800" />

                <select name="status" value={formData.status} onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded bg-white text-gray-800">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <input type="text" name="employee" placeholder="Employee In-Charge" value={formData.employee}
                    onChange={handleChange} className="w-full mb-2 p-2 border rounded bg-white text-gray-800" />

                <input type="text" name="quotationID" placeholder="Quotation Reference (Optional)" value={formData.quotationID}
                    onChange={handleChange} className="w-full mb-2 p-2 border rounded bg-white text-gray-800" />

                <input type="number" name="remainingBalance" placeholder="Remaining Balance" value={formData.remainingBalance}
                    onChange={handleChange} className="w-full mb-4 p-2 border rounded bg-white text-gray-800" />

                {/* Client Dropdown */}
                <select onChange={handleClientSelect} value={formData.client?.clientID || ''}
                    className="w-full mb-4 p-2 border rounded bg-white text-gray-800">
                    <option value="" disabled>Select Client</option>
                    {mockClients.map(client => (
                        <option key={client.clientID} value={client.clientID}>{client.name}</option>
                    ))}
                </select>

                {/* Read-only client fields */}
                {formData.client && (
                    <div className="grid grid-cols-1 gap-2 mb-4 text-gray-800 text-sm">
                        <input readOnly value={formData.client.licenseNo} className="p-2 border rounded bg-gray-100" placeholder="License No." />
                        <input readOnly value={formData.client.contactPerson} className="p-2 border rounded bg-gray-100" placeholder="Contact Person" />
                        <input readOnly value={formData.client.contactNumber} className="p-2 border rounded bg-gray-100" placeholder="Contact Number" />
                        <input readOnly value={formData.client.email} className="p-2 border rounded bg-gray-100" placeholder="Email" />
                    </div>
                )}

                {/* Ordered Items */}
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Items</h3>
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
                            <button className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => removeItem(index)}>Remove</button>
                        </div>
                    ))}
                    <button className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
                        onClick={addItem}>+ Add Item</button>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddOrderModal;
