// src/private/Delivery/Modals/EditDeliveryModal.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';

const EditDeliveryModal = ({ delivery, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...delivery });
  const drivers = ["Mark Reyes", "Sarah Cruz", "Alex Lim", "Peter Go"];
  const statuses = ["Pending", "In Transit", "Delivered", "Failed"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4 text-sm">
        <h2 className="text-xl font-bold text-gray-800">Edit Delivery</h2>

        <div>
          <label className="block font-medium mb-1">Customer</label>
          <input type="text" value={formData.customer} name="customer" onChange={handleChange}
            className="w-full border px-3 py-1 rounded bg-gray-100 text-gray-700" disabled />
        </div>

        <div>
          <label className="block font-medium mb-1">Address</label>
          <input type="text" value={formData.address} name="address" onChange={handleChange}
            className="w-full border px-3 py-1 rounded" />
        </div>

        <div>
          <label className="block font-medium mb-1">Assigned Driver</label>
          <select name="driver" value={formData.driver} onChange={handleChange}
            className="w-full border px-3 py-1 rounded">
            <option value="">Select Driver</option>
            {drivers.map(driver => (
              <option key={driver} value={driver}>{driver}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange}
            className="w-full border px-3 py-1 rounded">
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={handleSubmit}>Save</button>
          <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

EditDeliveryModal.propTypes = {
  delivery: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditDeliveryModal;
