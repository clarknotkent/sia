// src/private/Ordering/Modals/RefundOrderModal.jsx

import React, { useState } from 'react';

const RefundOrderModal = ({ order, onRefund, onClose }) => {
    const [reason, setReason] = useState('');

    const handleRefund = () => {
        if (!reason) {
            alert('Please enter the reason for refund.');
            return;
        }
        onRefund(order, reason);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Refund Order</h2>
                <p className="text-gray-800"><strong>Order ID:</strong> {order.orderID}</p>
                <textarea className="border p-2 w-full bg-white text-gray-800" placeholder="Reason for refund" value={reason} onChange={(e) => setReason(e.target.value)} />
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleRefund}>Process Refund</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RefundOrderModal;