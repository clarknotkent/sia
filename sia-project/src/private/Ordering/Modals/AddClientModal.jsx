// src/private/Ordering/Modals/AddClientModal.jsx

import React, { useState } from 'react';

const AddClientModal = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        clientID: '',
        name: '',
        licenseNo: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (formData.clientID && formData.name && formData.licenseNo) {
            onAdd(formData);
        } else {
            alert('All fields are required');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Client</h2>
                <input type="text" name="clientID" placeholder="Client ID" value={formData.clientID} 
                    onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
                <input type="text" name="name" placeholder="Client Name" value={formData.name} 
                    onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
                <input type="text" name="licenseNo" placeholder="License No." value={formData.licenseNo} 
                    onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
                <div className="flex justify-end space-x-2">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddClientModal;
