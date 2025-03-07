// src/private/Ordering/ProcessOrderModal.jsx

import React from 'react';

const ProcessOrderModal = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Process Order: {order?.orderID}</h2>
                <p>This is the placeholder for processing order {order?.orderID}.</p>
                <div className="mt-4 space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={onClose}>
                        Confirm
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProcessOrderModal;
