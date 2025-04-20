// src/private/Ordering/Modals/EditClientModal.jsx
import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const EditClientModal = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...client });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, licenseNo, contactPerson, contactNumber, email, address } = formData;
    if (name && licenseNo && contactPerson && contactNumber && email && address) {
      try {
        await axios.put(`http://localhost:5000/api/orders/clients/${formData.clientID}`, formData); // Updated endpoint
        onSave(formData); // Optional: if parent needs local update
        onClose();
      } catch (err) {
        console.error("Failed to update client:", err);
        alert("An error occurred while saving.");
      }
    } else {
      alert('All fields are required');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Edit Client Details</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Company Name</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-800"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">License No.</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="licenseNo"
                  value={formData.licenseNo}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-800"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Contact Person</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-800"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Contact Number</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-800"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Email</td>
              <td className="border px-4 py-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-800"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Address</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-800"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
        </div>
      </div>
    </div>
  );
};

EditClientModal.propTypes = {
  client: PropTypes.shape({
    clientID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    licenseNo: PropTypes.string.isRequired,
    contactPerson: PropTypes.string.isRequired,
    contactNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditClientModal;
