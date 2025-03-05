// src/private/Ordering/Modals/RefundOrderModal.jsx

import React, { useState } from 'react';

const RefundOrderModal = ({ order, onRefund, onClose }) => {
    const [refundReason, setRefundReason] = useState('');

    const handleRefund = () => {
        if (!refundReason.trim()) {
            alert('Please provide a reason for the refund.');
            return;
        }

        const refundedOrder = {
            ...order,
            status: 'Refunded',
            remainingBalance: 0,  // Optional: Automatically clear balance on refund
            refundReason: refundReason,
        };

        onRefund(refundedOrder);  // Call parent handler to update the order
        onClose();  // Close modal after processing
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Refund Order</h2>

                <div className="text-sm text-gray-700 mb-4 space-y-1">
                    <p><strong>Order ID:</strong> {order?.orderID}</p>
                    <p><strong>Client:</strong> {order?.clientName}</p>
                    <p><strong>Total Amount:</strong> ₱{order?.totalAmount.toLocaleString()}</p>
                </div>

                <textarea
                    className="border p-2 w-full bg-white text-gray-800 text-sm rounded"
                    placeholder="Reason for Refund"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    rows={3}
                />

                <div className="mt-4 flex justify-end space-x-2">
                    <button 
                        className="bg-red-500 text-white px-3 py-2 text-sm rounded hover:bg-red-600"
                        onClick={handleRefund}
                    >
                        Process Refund
                    </button>
                    <button 
                        className="bg-gray-500 text-white px-3 py-2 text-sm rounded hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RefundOrderModal;
