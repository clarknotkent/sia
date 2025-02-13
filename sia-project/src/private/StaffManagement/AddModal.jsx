// src/private/StaffManagement/AddModal.jsx

import React from 'react';

const AddModal = ({ showAddForm, newEmployee, handleChange, handleSubmit, handleCancel }) => {
  if (!showAddForm) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              className="w-full border p-2 bg-white text-black"
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Role</label>
            <input
              className="w-full border p-2 bg-white text-black"
              type="text"
              name="role"
              value={newEmployee.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              className="w-full border p-2 bg-white text-black"
              type="email"
              name="email"
              value={newEmployee.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Contact Number</label>
            <input
              className="w-full border p-2 bg-white text-black"
              type="text"
              name="contact"
              value={newEmployee.contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              type="submit"
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
