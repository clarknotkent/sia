// src/private/Ordering/Modals/ViewOrderModal.jsx

import React from 'react';

const ViewOrderModal = ({ order, onClose }) => {
    const { orderID, orderDate, status, totalAmount, remainingBalance, quotationID, employee, client, items = [] } = order;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>

                {/* Order Info */}
                <div className="space-y-2 text-gray-800 mb-4 text-sm">
                    <p><strong>Order ID:</strong> {orderID}</p>
                    <p><strong>Order Date:</strong> {orderDate}</p>
                    <p><strong>Status:</strong> {status}</p>
                    <p><strong>Total Amount:</strong> ₱{totalAmount?.toLocaleString()}</p>
                    <p><strong>Remaining Balance:</strong> ₱{remainingBalance?.toLocaleString()}</p>
                    <p><strong>Employee:</strong> {employee}</p>
                    <p><strong>Quotation Ref:</strong> {quotationID || '—'}</p>
                </div>

                <hr className="my-4" />

                {/* Client Info */}
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Client Information</h3>
                <div className="space-y-2 text-gray-800 text-sm mb-4">
                    <p><strong>Company Name:</strong> {client?.name}</p>
                    <p><strong>License No.:</strong> {client?.licenseNo}</p>
                    <p><strong>Contact Person:</strong> {client?.contactPerson}</p>
                    <p><strong>Contact Number:</strong> {client?.contactNumber}</p>
                    <p><strong>Email:</strong> {client?.email}</p>
                </div>

                {/* Items */}
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ordered Items</h3>
                <table className="w-full border border-gray-300 text-sm text-gray-800 mb-6">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 text-left">Item</th>
                            <th className="border p-2 text-right">Qty</th>
                            <th className="border p-2 text-right">Unit Price</th>
                            <th className="border p-2 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2 text-right">{item.quantity}</td>
                                <td className="border p-2 text-right">₱{item.unitPrice.toFixed(2)}</td>
                                <td className="border p-2 text-right">₱{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
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

export default ViewOrderModal;
