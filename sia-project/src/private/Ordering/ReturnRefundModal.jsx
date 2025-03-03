// src/private/Ordering/ReturnRefundModal.jsx

import React from 'react';

const ReturnRefundModal = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Return/Refund Order: {order?.orderID}</h2>
                <p>This is the placeholder for returning or refunding order {order?.orderID}.</p>
                <div className="mt-4 space-x-2">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
                        Process Refund
                    </button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnRefundModal;
