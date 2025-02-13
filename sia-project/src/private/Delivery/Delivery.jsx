// src/private/Delivery/Delivery.jsx

import React, { useState } from 'react';
import Sidebar from '../Sidebar';

const Delivery = () => {
  // Sample delivery data
  const [deliveries, setDeliveries] = useState([
    { id: 1, customer: 'Alice Johnson', address: '123 Main St', status: 'Pending' },
    { id: 2, customer: 'Bob Williams', address: '456 Elm St', status: 'In Progress' },
  ]);

  // State for modal
  const [modal, setModal] = useState({ show: false, delivery: null });

  // Function to update status
  const updateStatus = (id, newStatus) => {
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      )
    );
    setModal({ show: false, delivery: null }); // Close modal after selecting
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">Delivery Management</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
          <table className="w-full border-collapse border border-gray-300 text-black">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border p-2">Customer</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="text-center text-black">
                  <td className="border p-2">{delivery.customer}</td>
                  <td className="border p-2">{delivery.address}</td>
                  <td
                    className={`border p-2 font-semibold ${
                      delivery.status === 'Pending'
                        ? 'text-red-500'
                        : delivery.status === 'In Progress'
                        ? 'text-yellow-500'
                        : delivery.status === 'Delivered'
                        ? 'text-green-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {delivery.status}
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => setModal({ show: true, delivery })}
                    >
                      Actions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL POPUP */}
        {modal.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Update Delivery Status
              </h2>
              <p className="text-gray-700 mb-4">
                Choose an action for <strong>{modal.delivery.customer}</strong>
              </p>

              <div className="flex space-x-4">
                {/* Start Delivery */}
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400"
                  onClick={() => updateStatus(modal.delivery.id, 'In Progress')}
                  disabled={modal.delivery.status !== 'Pending'}
                >
                  Start Delivery
                </button>

                {/* Mark as Delivered */}
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                  onClick={() => updateStatus(modal.delivery.id, 'Delivered')}
                  disabled={modal.delivery.status !== 'In Progress'}
                >
                  Delivered
                </button>

                {/* Cancel Delivery */}
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                  onClick={() => updateStatus(modal.delivery.id, 'Cancelled')}
                  disabled={modal.delivery.status === 'Delivered'}
                >
                  Cancel
                </button>
              </div>

              {/* Close Modal Button */}
              <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setModal({ show: false, delivery: null })}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
