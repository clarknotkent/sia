// src/private/Ordering/Modals/ViewOrderModal.jsx

import React from 'react';

const ViewOrderModal = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
                <p className="text-gray-800"><strong>Order ID:</strong> {order.orderID}</p>
                <p className="text-gray-800"><strong>Client:</strong> {order.clientName}</p>
                <p className="text-gray-800"><strong>Order Date:</strong> {order.orderDate}</p>
                <p className="text-gray-800"><strong>Total Amount:</strong> ₱{order.totalAmount.toLocaleString()}</p>
                <p className="text-gray-800"><strong>Status:</strong> {order.status}</p>
                <div className="mt-4 flex justify-end">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderModal;