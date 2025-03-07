// src/private/Ordering/Modals/ViewQuotationModal.jsx

import React from 'react';

const ViewQuotationModal = ({ quotation, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quotation Details</h2>
                <p className="text-gray-800"><strong>Quotation ID:</strong> {quotation.quotationID}</p>
                <p className="text-gray-800"><strong>Client:</strong> {quotation.clientName}</p>
                <p className="text-gray-800"><strong>Date:</strong> {quotation.quotationDate}</p>
                <div className="mt-4 flex justify-end">
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewQuotationModal;