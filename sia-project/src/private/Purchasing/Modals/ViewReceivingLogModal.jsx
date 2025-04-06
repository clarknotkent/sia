// src/private/Purchasing/Modals/ViewReceivingLogModal.jsx
import React from 'react';

const ViewReceivingLogModal = ({ log, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Receiving Log Details</h2>
      <div className="space-y-2 text-sm">
        <p><strong>Log ID:</strong> {log.logID}</p>
        <p><strong>PO Number:</strong> {log.poID}</p>
        <p><strong>Supplier:</strong> {log.supplier}</p>
        <p><strong>Date Received:</strong> {log.dateReceived}</p>
        <p><strong>Status:</strong> {log.status}</p>
      </div>

      <div className="mt-4 flex justify-end gap-2">
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

export default ViewReceivingLogModal;
