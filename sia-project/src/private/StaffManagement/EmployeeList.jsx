import React, { useState } from 'react';

const ViewEmployeeList = ({ employees, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState(''); // ADD THIS LINE TO DEFINE searchTerm

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2 text-black">View Employee List</h2>
      <input
        type="text"
        placeholder="Search Employees"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-4 bg-white text-black"
      />

      <ul className="space-y-2">
        {filteredEmployees.map((emp) => (
          <li
            key={emp.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div className="text-black">
              <strong>{emp.name}</strong> - {emp.role}
            </div>
            <div>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                onClick={() => onEdit(emp)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => onDelete(emp.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewEmployeeList;
