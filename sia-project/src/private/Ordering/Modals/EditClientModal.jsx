// src/private/Ordering/Modals/EditClientModal.jsx

import React, { useState } from 'react';

const EditClientModal = ({ client, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...client });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { name, licenseNo, contactPerson, contactNumber, email } = formData;
        if (name && licenseNo && contactPerson && contactNumber && email) {
            onSave(formData);
            onClose();
        } else {
            alert('All fields are required');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Client Details</h2>
                <div className="space-y-3 text-gray-800">
                    <input
                        className="border p-2 w-full rounded bg-white"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Company Name"
                    />
                    <input
                        className="border p-2 w-full rounded bg-white"
                        name="licenseNo"
                        value={formData.licenseNo}
                        onChange={handleChange}
                        placeholder="License No."
                    />
                    <input
                        className="border p-2 w-full rounded bg-white"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="Contact Person"
                    />
                    <input
                        className="border p-2 w-full rounded bg-white"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="Contact Number"
                    />
                    <input
                        className="border p-2 w-full rounded bg-white"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditClientModal;
 