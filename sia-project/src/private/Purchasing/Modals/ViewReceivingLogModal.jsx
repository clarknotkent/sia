// src/private/Purchasing/Modals/ViewReceivingLogModal.jsx
import React from 'react';

const ViewReceivingLogModal = ({ log, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Receiving Log Details</h2>
            <p className="text-gray-800"><strong>Log ID:</strong> {log.logID}</p>
            <p className="text-gray-800"><strong>PO Number:</strong> {log.poID}</p>
            <p className="text-gray-800"><strong>Supplier:</strong> {log.supplier}</p>
            <p className="text-gray-800"><strong>Date Received:</strong> {log.dateReceived}</p>
            <p className="text-gray-800"><strong>Status:</strong> {log.status}</p>

            <div className="mt-4 flex justify-end gap-2">
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    </div>
);

export default ViewReceivingLogModal;
