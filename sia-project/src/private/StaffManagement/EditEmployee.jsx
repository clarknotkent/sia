// src/private/StaffManagement/EditEmployee.jsx
import React, { useState } from 'react';

const EditEmployee = ({ employee, updateEmployee, cancelEdit }) => {
  const [name, setName] = useState(employee.name);
  const [role, setRole] = useState(employee.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEmployee({ ...employee, name, role });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Edit Employee Details</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-800 p-2 rounded w-full mb-2 bg-white text-black"
        required
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border border-gray-800 p-2 rounded w-full mb-2 bg-white text-black"
        required
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={cancelEdit}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditEmployee; 