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

const AddQuotationModal = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        quotationID: '',
        quotationDate: '',
        status: 'Pending',
        client: null,
        items: [{ name: '', quantity: 0, unitPrice: 0 }],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClientSelect = (e) => {
        const selectedID = e.target.value;
        const selectedClient = mockClients.find(c => c.clientID === selectedID);
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
        const updatedItems = [...formData.items];
        updatedItems.splice(index, 1);
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleSubmit = () => {
        const { quotationID, quotationDate, client, items } = formData;

        if (!quotationID || !quotationDate || !client) {
            alert("Please fill in all required fields.");
            return;
        }

        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

        const newQuotation = {
            ...formData,
            totalAmount,
        };

        onAdd(newQuotation);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Quotation</h2>

                {/* Quotation Info */}
                <div className="space-y-2 mb-4">
                    <input
                        name="quotationID"
                        placeholder="Quotation ID"
                        value={formData.quotationID}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    />
                    <input
                        type="date"
                        name="quotationDate"
                        value={formData.quotationDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {/* Client Selector */}
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Client</h3>
                <select
                    onChange={handleClientSelect}
                    className="w-full mb-4 p-2 border rounded bg-white text-gray-800"
                    value={formData.client?.clientID || ''}
                >
                    <option value="" disabled>Select a client</option>
                    {mockClients.map(client => (
                        <option key={client.clientID} value={client.clientID}>
                            {client.name}
                        </option>
                    ))}
                </select>

                {/* Auto-filled client info */}
                {formData.client && (
                    <div className="grid grid-cols-1 gap-2 mb-4 text-gray-800 text-sm">
                        <input readOnly value={formData.client.licenseNo} className="w-full p-2 border rounded bg-gray-100" placeholder="License No." />
                        <input readOnly value={formData.client.contactPerson} className="w-full p-2 border rounded bg-gray-100" placeholder="Contact Person" />
                        <input readOnly value={formData.client.contactNumber} className="w-full p-2 border rounded bg-gray-100" placeholder="Contact Number" />
                        <input readOnly value={formData.client.email} className="w-full p-2 border rounded bg-gray-100" placeholder="Email" />
                    </div>
                )}

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
                <div className="flex justify-end space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddQuotationModal;