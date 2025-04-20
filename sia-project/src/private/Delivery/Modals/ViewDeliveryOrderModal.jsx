// src/private/Delivery/Modals/ViewDeliveryOrderModal.jsx
import PropTypes from 'prop-types';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Use environment variable

const ViewDeliveryOrderModal = ({ order, onClose, onDelivered }) => {
  const {
    orderID, orderDate, status, totalAmount, remainingBalance, client, items = []
  } = order;

  const formattedDate = orderDate ? (() => {
    const d = new Date(orderDate);
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()} | ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  })() : '';

  const handleCreateDelivery = async () => {
    try {
      const payload = {
        orderID: order.orderID,
        customer: order.client?.name,
        address: order.client?.address,
        driver: "John Doe", // Example driver
        date: new Date().toISOString(),
      };

      await axios.post(`${API_BASE_URL}/delivery`, payload); // ✅ Create delivery in backend

      if (onDelivered) onDelivered(); // ✅ Refresh parent (ShipList)
      onClose(); // ✅ Close modal
      alert("Delivery created and transferred to Delivery Table.");
    } catch (err) {
      console.error("Failed to create delivery:", err);
      alert("Error creating delivery.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative text-gray-800">
        <h2 className="text-xl font-bold text-center mb-4">View Order Details</h2>

        <div className="mb-4 space-y-1 text-sm">
          <p><strong>Order ID:</strong> {orderID}</p>
          <p><strong>Date:</strong> {formattedDate}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Total:</strong> ₱{totalAmount?.toLocaleString()}</p>
          <p><strong>Remaining:</strong> ₱{remainingBalance?.toLocaleString()}</p>
        </div>

        <h3 className="text-md font-semibold mb-2">Client Info</h3>
        <div className="text-sm space-y-1 mb-4">
          <p><strong>Name:</strong> {client?.name}</p>
          <p><strong>Contact:</strong> {client?.contactNumber}</p>
          <p><strong>Email:</strong> {client?.email}</p>
        </div>

        <h3 className="text-md font-semibold mb-2">Order Items</h3>
        <table className="w-full text-sm border border-gray-300 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-right">Qty</th>
              <th className="border p-2 text-right">Price</th>
              <th className="border p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">₱{item.unitPrice.toFixed(2)}</td>
                <td className="border p-2 text-right">₱{(item.unitPrice * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleCreateDelivery}
          >
            Create Delivery
          </button>
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

ViewDeliveryOrderModal.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelivered: PropTypes.func // ✅ Optional prop
};

export default ViewDeliveryOrderModal;
