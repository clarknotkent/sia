// src/private/Purchasing/Modals/ViewSupplierModal.jsx
import React from 'react';

const ViewSupplierModal = ({ supplier, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Supplier Details</h2>

      <div className="space-y-2 text-sm">
        <p><strong>ID:</strong> {supplier.supplierID}</p>
        <p><strong>Name:</strong> {supplier.name}</p>
        <p><strong>Contact Person:</strong> {supplier.contactPerson}</p>
        <p><strong>Contact Number:</strong> {supplier.contactNumber}</p>
      </div>

      <div className="flex justify-end mt-6">
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

export default ViewSupplierModal;
