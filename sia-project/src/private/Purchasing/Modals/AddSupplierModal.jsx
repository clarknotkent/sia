// src/private/Purchasing/Modals/AddSupplierModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AddSupplierModal = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    supplierID: '',
    name: '',
    contactPerson: '',
    contactNumber: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { supplierID, name, contactPerson, contactNumber } = formData;
    if (supplierID && name && contactPerson && contactNumber) {
      try {
        const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        await axios.post(`${API}/purchasing/suppliers`, formData);
        onAdd();    // trigger parent to refetch
        onClose();  // close the modal
      } catch (err) {
        alert(
          'Failed to add supplier: ' +
          (err.response?.data?.error || err.message)
        );
        console.error('Add supplier error:', err);
      }
    } else {
      alert('All fields are required');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add New Supplier
        </h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Supplier ID</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="supplierID"
                  value={formData.supplierID}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-800"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Supplier Name</td>
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
          </tbody>
        </table>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

AddSupplierModal.propTypes = {
  onAdd:    PropTypes.func.isRequired,
  onClose:  PropTypes.func.isRequired,
};

export default AddSupplierModal;
