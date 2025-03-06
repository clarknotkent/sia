import React from 'react';

const ViewPurchaseOrderModal = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Purchase Order Details</h2>
                <p><strong>PO Number:</strong> {order.poNumber}</p>
                <p><strong>Supplier Name:</strong> {order.supplierName}</p>
                <p><strong>Order Date:</strong> {order.orderDate}</p>
                <p><strong>Total Amount:</strong> ₱{order.totalAmount.toLocaleString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <div className="flex justify-end mt-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewPurchaseOrderModal;
