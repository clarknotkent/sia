// src/private/Ordering/Modals/ViewClientModal.jsx

import React from 'react';

const ViewClientModal = ({ client, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Client Details</h2>
                <p className="text-gray-800"><strong>Client ID:</strong> {client.clientID}</p>
                <p className="text-gray-800"><strong>Name:</strong> {client.name}</p>
                <p className="text-gray-800"><strong>License No:</strong> {client.licenseNo}</p>
                <div className="mt-4 flex justify-end">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewClientModal;