// src/private/StaffManagement/ViewStaffModal.jsx
import React from 'react';

const ViewStaffModal = ({ staff, onClose }) => {
  if (!staff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg relative text-gray-800">
        <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
        <div className="space-y-2">
          <p><strong>Employee ID:</strong> {staff.id}</p>  {/* Use staff.id instead of staff.employeeId */}
          <p><strong>Name:</strong> {staff.name}</p>
          <p><strong>Role:</strong> {staff.role}</p>
          <p><strong>Email:</strong> {staff.email}</p>
          {/* Add more fields if needed */}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-4 rounded transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStaffModal;
