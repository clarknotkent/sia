// src/private/StaffManagement/AddEmployee.jsx
import React, { useState } from 'react';

const AddEmployee = ({ addEmployee }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [credentials, setCredentials] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addEmployee({ name, role, credentials });
    setName('');
    setRole('');
    setCredentials('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Add New Employee</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-800 p-2 rounded w-full mb-2 bg-white text-black"
        required
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border border-gray-800 p-2 rounded w-full mb-2 bg-white text-black"
        required
      />
      <input
        type="text"
        placeholder="Initial Credentials"
        value={credentials}
        onChange={(e) => setCredentials(e.target.value)}
        className="border border-gray-800 p-2 rounded w-full mb-2 bg-white text-black"
        required
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Save & Notify Employee
      </button>
    </form>
  );
};

export default AddEmployee;
