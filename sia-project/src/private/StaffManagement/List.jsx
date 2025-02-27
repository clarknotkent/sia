// src/private/StaffManagement/List.jsx

import React from 'react';

const List = ({ employees, confirmAction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200 text-gray-800 font-semibold">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Contact Number</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr
              key={index}
              className={`text-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            >
              <td className={`border border-gray-300 px-4 py-2 ${emp.status === 'Suspended' ? 'text-red-500' : 'text-black'}`}>
                {emp.name}
              </td>
              <td className={`border border-gray-300 px-4 py-2 ${emp.status === 'Suspended' ? 'text-red-500' : 'text-black'}`}>
                {emp.role}
              </td>
              <td className={`border border-gray-300 px-4 py-2 ${emp.status === 'Suspended' ? 'text-red-500' : 'text-black'}`}>
                {emp.email}
              </td>
              <td className={`border border-gray-300 px-4 py-2 ${emp.status === 'Suspended' ? 'text-red-500' : 'text-black'}`}>
                {emp.contact}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition-all"
                  onClick={() => confirmAction('toggleStatus', emp)}
                >
                  {emp.status === 'Active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
                  onClick={() => confirmAction('remove', emp)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
