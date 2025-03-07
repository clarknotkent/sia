// src/private/Ordering/Modals/AddQuotationModal.jsx

import React, { useState } from 'react';

const AddQuotationModal = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        quotationID: '',
        clientName: '',
        quotationDate: '',
        status: 'Pending',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (formData.quotationID && formData.clientName && formData.quotationDate) {
            onAdd(formData);
        } else {
            alert('All fields are required');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Quotation</h2>
                <input type="text" name="quotationID" placeholder="Quotation ID" value={formData.quotationID}
                       onChange={handleChange} className="w-full mb-2 p-2 border rounded bg-white text-gray-800" />
                <input type="text" name="clientName" placeholder="Client Name" value={formData.clientName}
                       onChange={handleChange} className="w-full mb-2 p-2 border rounded bg-white text-gray-800" />
                <input type="date" name="quotationDate" value={formData.quotationDate}
                       onChange={handleChange} className="w-full mb-2 p-2 border rounded bg-white text-gray-800" />
                <select name="status" value={formData.status} onChange={handleChange}
                        className="w-full mb-4 p-2 border rounded bg-white text-gray-800">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <div className="flex justify-end space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddQuotationModal;
