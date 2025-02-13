// src/private/Delivery/Assign.jsx

import React, { useState } from 'react';

const Assign = ({ delivery, closeModal, setDeliveries }) => {
  const [assignedDriver, setAssignedDriver] = useState('');

  const handleAssign = () => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === delivery.id ? { ...d, status: `Assigned to ${assignedDriver}` } : d))
    );
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Assign Delivery</h2>
        <p>Recipient: <strong>{delivery.recipient}</strong></p>
        <p>Address: <strong>{delivery.address}</strong></p>
        <input
          type="text"
          placeholder="Enter Driver Name"
          value={assignedDriver}
          onChange={(e) => setAssignedDriver(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mt-2"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleAssign}>Assign</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Assign;
