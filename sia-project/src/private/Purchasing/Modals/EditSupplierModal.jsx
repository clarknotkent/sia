// src/private/Purchasing/Modals/EditSupplierModal.jsx
import React, { useState, useEffect } from 'react';

const EditSupplierModal = ({ supplier, onSave, onClose }) => {
  // Initialize formData with an empty object
  const [formData, setFormData] = useState({
    supplierID: '',
    name: '',
    contactPerson: '',
    contactNumber: ''
  });

  // When the supplier prop changes (modal is opened), populate the form
  useEffect(() => {
    if (supplier) {
      setFormData({ ...supplier }); // Populate with supplier data
    }
  }, [supplier]); // Only run when supplier changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData); // Pass updated data to parent component
    onClose(); // Close modal after saving
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Supplier</h2>
        
        {/* Inputs populated with formData */}
        <input
          className="border p-2 w-full mb-2 bg-white text-gray-800"
          name="supplierID"
          value={formData.supplierID || ''}
          disabled
        />
        <input
          className="border p-2 w-full mb-2 bg-white text-gray-800"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Supplier Name"
        />
        <input
          className="border p-2 w-full mb-2 bg-white text-gray-800"
          name="contactPerson"
          value={formData.contactPerson || ''}
          onChange={handleChange}
          placeholder="Contact Person"
        />
        <input
          className="border p-2 w-full mb-2 bg-white text-gray-800"
          name="contactNumber"
          value={formData.contactNumber || ''}
          onChange={handleChange}
          placeholder="Contact Number"
        />
        
        <div className="flex justify-end gap-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Save
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSupplierModal;
