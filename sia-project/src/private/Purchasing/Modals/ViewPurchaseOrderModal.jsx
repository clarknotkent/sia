// src/private/Purchasing/Modals/ViewPurchaseOrderModal.jsx
import React from 'react';

const ViewPurchaseOrderModal = ({ order, onClose }) => {
  const totalAmount = order.items?.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Purchase Order Details</h2>

        <div className="mb-4 text-sm space-y-1">
          <p><strong>PO Number:</strong> {order.poID}</p>
          <p><strong>Supplier:</strong> {order.supplier}</p>
          <p><strong>Order Date:</strong> {order.orderDate}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>

        <h3 className="text-lg font-semibold mb-2">Ordered Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400 text-sm bg-white text-gray-900">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Item</th>
                <th className="border border-gray-300 p-2 text-center">Qty</th>
                <th className="border border-gray-300 p-2 text-right">Unit Price</th>
                <th className="border border-gray-300 p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{item.name}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-2 text-right">₱{item.unitPrice.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">₱{(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border p-2 text-center" colSpan="4">No items listed.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-right font-semibold mt-2">
          Total: ₱{totalAmount?.toFixed(2)}
        </div>

        <div className="flex justify-end mt-4">
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

export default ViewPurchaseOrderModal;
