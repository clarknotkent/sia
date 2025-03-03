// src/private/Ordering/Modals/EditQuotationModal.jsx

import React, { useState } from 'react';

const EditQuotationModal = ({ quotation, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...quotation });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Quotation</h2>
                <input className="border p-2 w-full mb-2 bg-white text-gray-800" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Client Name" />
                <input className="border p-2 w-full mb-4 bg-white text-gray-800" name="quotationDate" value={formData.quotationDate} onChange={handleChange} placeholder="Date" />
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSubmit}>Save</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditQuotationModal;