// src/private/Delivery/Modals/EditDeliveryModal.jsx
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditDeliveryModal = ({ delivery, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...delivery });
  const [drivers, setDrivers] = useState([]);
  const statuses = ["Pending", "In Transit", "Delivered", "Failed"];

  useEffect(() => {
    // Fetch staff with Delivery role and Active status
    axios.get(`${API_BASE_URL}/staff?role=Delivery&status=Active`)
      .then(res => {
        setDrivers(res.data || []);
        // If current driver is not in the list, keep it as is; else, default to first driver
        if (res.data && res.data.length > 0 && !res.data.some(d => d.name === formData.driver)) {
          setFormData(prev => ({ ...prev, driver: res.data[0].name }));
        }
      })
      .catch(() => setDrivers([]));
    // eslint-disable-next-line
  }, []);

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
          <label className="block font-medium mb-1 text-gray-800">Customer</label>
          <input
            type="text"
            value={formData.customer}
            name="customer"
            className="w-full border px-3 py-1 rounded bg-white text-black"
            disabled
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-800">Address</label>
          <input
            type="text"
            value={formData.address}
            name="address"
            className="w-full border px-3 py-1 rounded bg-white text-black"
            disabled
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-800">Assigned Driver</label>
          <select
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            className="w-full border px-3 py-1 rounded bg-white text-black"
          >
            <option value="">Select Driver</option>
            {drivers.map(driver => (
              <option key={driver.id || driver.name} value={driver.name}>{driver.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-800">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-1 rounded bg-white text-black"
          >
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
