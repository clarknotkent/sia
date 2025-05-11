// src/private/Ordering/Modals/AddClientModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AddClientModal = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    clientID: '',
    name: '',
    licenseNo: '',
    address: '', // ✅ New field
    contactPerson: '',
    contactNumber: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { clientID, name, licenseNo, address, contactPerson, contactNumber, email } = formData;
    if (clientID && name && licenseNo && address && contactPerson && contactNumber && email) {
      try {
        await axios.post('http://localhost:5000/api/orders/clients', formData); // POST request
        onAdd(); // Trigger a refetch in the parent component
        onClose();
      } catch (err) {
        alert("Failed to add client: " + (err.response?.data?.error || err.message));
        console.error("Add client error:", err);
      }
    } else {
      alert('All fields are required');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Company Client</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Client ID</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="clientID"
                  value={formData.clientID}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-800"
                />
              </td>
            </tr>
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
          </tbody>
        </table>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
        </div>
      </div>
    </div>
  );
};

AddClientModal.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddClientModal;
