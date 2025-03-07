//src/private/Purchasing/Modals/ViewSupplierModal.jsx
import React from 'react';

const ViewSupplierModal = ({ supplier, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Supplier Details</h2>
            <p><strong>ID:</strong> {supplier.supplierID}</p>
            <p><strong>Name:</strong> {supplier.name}</p>
            <p><strong>Contact Person:</strong> {supplier.contactPerson}</p>
            <p><strong>Contact Number:</strong> {supplier.contactNumber}</p>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
        </div>
    </div>
);

export default ViewSupplierModal;
