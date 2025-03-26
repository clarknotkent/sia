// src/private/Ordering/Modals/AddClientModal.jsx

import React, { useState } from 'react';

const AddClientModal = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        clientID: '',
        name: '',
        licenseNo: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { clientID, name, licenseNo, contactPerson, contactNumber, email } = formData;
        if (clientID && name && licenseNo && contactPerson && contactNumber && email) {
            onAdd(formData);
            onClose();
        } else {
            alert('All fields are required');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Company Client</h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        name="clientID"
                        placeholder="Client ID"
                        value={formData.clientID}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Company Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    />
                    <input
                        type="text"
                        name="licenseNo"
                        placeholder="License No."
                        value={formData.licenseNo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    />
                    <input
                        type="text"
                        name="contactPerson"
                        placeholder="Contact Person"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    />
                    <input
                        type="text"
                        name="contactNumber"
                        placeholder="Contact Number"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-gray-800"
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                        Save
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddClientModal;
