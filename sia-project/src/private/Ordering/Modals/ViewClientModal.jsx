// src/private/Ordering/Modals/ViewClientModal.jsx

import React from 'react';

const ViewClientModal = ({ client, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Client Details</h2>
                <div className="space-y-2 text-gray-800">
                    <p><strong>Client ID:</strong> {client.clientID}</p>
                    <p><strong>Company Name:</strong> {client.name}</p>
                    <p><strong>License No.:</strong> {client.licenseNo}</p>
                    <p><strong>Contact Person:</strong> {client.contactPerson}</p>
                    <p><strong>Contact Number:</strong> {client.contactNumber}</p>
                    <p><strong>Email:</strong> {client.email}</p>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewClientModal;
