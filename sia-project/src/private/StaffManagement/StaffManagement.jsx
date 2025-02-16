// src/private/StaffManagement/StaffManagement.jsx
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import List from './List';
import AddModal from './AddModal';
import ConfirmModal from './ConfirmModal';

const StaffManagement = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      role: 'Manager',
      email: 'john@example.com',
      contact: '123-456-7890',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Cashier',
      email: 'jane@example.com',
      contact: '987-654-3210',
      status: 'Active',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', email: '', contact: '' });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: '',
    employee: null,
  });

  /* ----------------------- ADD EMPLOYEE LOGIC ----------------------- */
  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAdd = () => setShowAddForm(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmployees([...employees, { id: Date.now(), ...newEmployee, status: 'Active' }]);
    setNewEmployee({ name: '', role: '', email: '', contact: '' });
    setShowAddForm(false);
  };
  const handleCancel = () => setShowAddForm(false);

  /* ----------------------- SUSPEND / REMOVE LOGIC ----------------------- */
  const toggleStatus = (id) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: emp.status === 'Active' ? 'Suspended' : 'Active' } : emp))
    );
  };

  const handleRemove = (id) => setEmployees((prev) => prev.filter((emp) => emp.id !== id));

  /* ----------------------- CONFIRMATION MODAL ----------------------- */
  const confirmAction = (action, employee) => setConfirmModal({ show: true, action, employee });
  const handleConfirm = () => {
    if (confirmModal.action === 'toggleStatus') toggleStatus(confirmModal.employee.id);
    if (confirmModal.action === 'remove') handleRemove(confirmModal.employee.id);
    setConfirmModal({ show: false, action: '', employee: null });
  };
  const handleCancelConfirm = () => setConfirmModal({ show: false, action: '', employee: null });

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Staff Management</h1>

        {/* ✅ Table Container - Matches Inventory Management Layout */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <List employees={employees} confirmAction={confirmAction} />

          {/* ✅ Button Container - Same Placement as Inventory Management */}
          <div className="flex justify-start mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleAdd}>
              Add New Employee
            </button>
          </div>
        </div>

        {/* Add Employee Modal */}
        <AddModal
          showAddForm={showAddForm}
          newEmployee={newEmployee}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />

        {/* Confirmation Modal (Suspend/Activate/Remove) */}
        <ConfirmModal confirmModal={confirmModal} handleConfirm={handleConfirm} handleCancelConfirm={handleCancelConfirm} />
      </div>
    </div>
  );
};

export default StaffManagement;
