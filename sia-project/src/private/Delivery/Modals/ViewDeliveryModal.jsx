// src/private/Delivery/Modals/ViewDeliveryModal.jsx
import PropTypes from "prop-types";

const ViewDeliveryModal = ({ delivery, onClose }) => {
  // Fallbacks for client info if not present
  const client = delivery.client || {};
  const orders = delivery.items || delivery.orders || [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900">Delivery Details</h2>
        <div className="text-sm space-y-2 text-gray-900">
          <p><strong>Delivery ID:</strong> {delivery.deliveryID}</p>
          <p><strong>Order ID:</strong> {delivery.orderID}</p>
          <p><strong>Customer:</strong> {delivery.customer || client.name}</p>
          <p><strong>Address:</strong> {delivery.address || client.address}</p>
          <p><strong>Contact Person:</strong> {client.contactPerson || client.name || "N/A"}</p>
          <p><strong>Contact Number:</strong> {client.contactNumber || client.contact || "N/A"}</p>
          <p><strong>Customer Email:</strong> {client.email || "N/A"}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
          {orders.length === 0 ? (
            <p className="text-gray-700">No items found.</p>
          ) : (
            <table className="w-full text-sm border border-gray-300 mb-2 text-gray-900">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Item</th>
                  <th className="border p-2 text-right">Qty</th>
                  <th className="border p-2 text-right">Unit Price</th>
                  <th className="border p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item, i) => (
                  <tr key={i}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2 text-right">{item.quantity}</td>
                    <td className="border p-2 text-right">₱{item.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="border p-2 text-right">₱{(item.unitPrice * item.quantity)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewDeliveryModal.propTypes = {
  delivery: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewDeliveryModal;
