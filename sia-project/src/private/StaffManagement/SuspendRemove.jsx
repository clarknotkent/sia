// src/private/StaffManagement/SuspendRemoveEmployee.jsx
import React from 'react';

const SuspendRemoveEmployee = ({ employee, suspendEmployee, removeEmployee }) => (
  <div className="mb-4">
    <h2 className="text-xl font-semibold mb-2">Suspend / Remove Employee</h2>
    <button
      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
      onClick={() => suspendEmployee(employee.id)}
    >
      Mark as Inactive
    </button>
    <button
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      onClick={() => removeEmployee(employee.id)}
    >
      Delete Account Permanently
    </button>
  </div>
);

export default SuspendRemoveEmployee; 