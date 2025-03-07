// src/private/Purchasing/Modals/ViewPurchaseOrderModal.jsx=
import React from 'react';

const ViewPurchaseOrderModal = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Purchase Order Details</h2>
                <p><strong>PO Number:</strong> {order.poNumber}</p>
                <p><strong>Supplier:</strong> {order.supplier}</p>
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Status:</strong> {order.status}</p>

                <h3 className="mt-4 font-bold">Items</h3>
                <table className="w-full mt-2 border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Item</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Unit Price</th>
                            <th className="border p-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.length > 0 ? (
                            order.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{item.name}</td>
                                    <td className="border p-2">{item.quantity}</td>
                                    <td className="border p-2">₱{item.unitPrice.toLocaleString()}</td>
                                    <td className="border p-2">₱{(item.quantity * item.unitPrice).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border p-2 text-center" colSpan="4">No items added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-end">
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewPurchaseOrderModal;
