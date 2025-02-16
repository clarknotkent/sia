// src/private/Delivery/Update.jsx

import React, { useState } from 'react';

const Update = ({ delivery, closeModal, setDeliveries }) => {
  const [status, setStatus] = useState(delivery.status);

  const handleUpdate = () => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === delivery.id ? { ...d, status } : d))
    );
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Update Delivery Status</h2>
        <p>Recipient: <strong>{delivery.recipient}</strong></p>
        <p>Address: <strong>{delivery.address}</strong></p>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mt-2"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Delivered">Delivered</option>
        </select>
        <div className="flex justify-end mt-4 space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleUpdate}>Update</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Update;
