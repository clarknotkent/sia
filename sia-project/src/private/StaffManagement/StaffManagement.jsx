// src/private/StaffManagement/StaffManagement.jsx
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import EmployeeList from './EmployeeList';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';

const StaffManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const addEmployee = (employee) => {
    setEmployees([...employees, { id: Date.now(), ...employee, status: 'Active' }]);
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployees(
      employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
    setEditingEmployee(null);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const suspendEmployee = (id) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, status: emp.status === 'Active' ? 'Suspended' : 'Active' } : emp
      )
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Staff Management</h1>
        <AddEmployee addEmployee={addEmployee} />
        <EmployeeList
          employees={employees}
          onEdit={setEditingEmployee}
          onDelete={deleteEmployee}
          onSuspend={suspendEmployee}
        />
        {editingEmployee && (
          <EditEmployee
            employee={editingEmployee}
            updateEmployee={updateEmployee}
            cancelEdit={() => setEditingEmployee(null)}
          />
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
