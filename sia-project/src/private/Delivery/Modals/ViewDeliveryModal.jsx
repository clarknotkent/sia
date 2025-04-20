// src/private/Delivery/Modals/ViewDeliveryModal.jsx
import PropTypes from "prop-types";

const ViewDeliveryModal = ({ delivery, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Delivery Details</h2>
        <div className="text-sm space-y-2 text-gray-700">
          <p><strong>Delivery ID:</strong> {delivery.deliveryID}</p>
          <p><strong>Order ID:</strong> {delivery.orderID}</p>
          <p><strong>Customer:</strong> {delivery.customer}</p>
          <p><strong>Address:</strong> {delivery.address}</p>
          <p><strong>Driver:</strong> {delivery.driver || "Unassigned"}</p>
          <p><strong>Status:</strong> {delivery.status}</p>
          <p><strong>Date:</strong> {delivery.date}</p>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>Close</button>
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
