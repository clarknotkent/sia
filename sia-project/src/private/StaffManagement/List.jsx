// src/private/StaffManagement/List.jsx

import React from 'react';

const List = ({ employees, confirmAction }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          <th className="border-b p-2">Name</th>
          <th className="border-b p-2">Role</th>
          <th className="border-b p-2">Email</th>
          <th className="border-b p-2">Contact Number</th>
          <th className="border-b p-2"> </th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id}>
            <td className={`border-b p-2 ${emp.status === 'Suspended' ? 'text-red-500' : 'text-black'}`}>
              {emp.name}
            </td>
            <td className={`border-b p-2 ${emp.status === 'Suspended' ? 'text-red-500' : 'text-black'}`}>
              {emp.role}
            </td>
            <td className={`border-b p-2 ${emp.status === 'Suspended' ? 'text-red-500' : 'text-black'}`}>
              {emp.email}
            </td>
            <td className={`border-b p-2 ${emp.status === 'Suspended' ? 'text-red-500' : 'text-black'}`}>
              {emp.contact}
            </td>
            <td className="border-b p-2">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                onClick={() => confirmAction('toggleStatus', emp)}
              >
                {emp.status === 'Active' ? 'Suspend' : 'Activate'}
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => confirmAction('remove', emp)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default List;
