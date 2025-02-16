// src/private/Delivery/List.jsx

import React from 'react';

const List = ({ deliveries, onAssign, onUpdate }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="border p-2">Recipient</th>
          <th className="border p-2">Address</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {deliveries.map((delivery) => (
          <tr key={delivery.id} className="text-center">
            <td className="border p-2">{delivery.recipient}</td>
            <td className="border p-2">{delivery.address}</td>
            <td className="border p-2">{delivery.status}</td>
            <td className="border p-2 space-x-2">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" onClick={() => onAssign(delivery)}>Assign</button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => onUpdate(delivery)}>Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default List;
