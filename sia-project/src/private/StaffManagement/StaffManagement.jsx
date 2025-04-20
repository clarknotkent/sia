import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import List from './List';
import AddModal from './AddModal';
import ConfirmModal from './ConfirmModal';

const StaffManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', email: '', contact: '' });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: '',
    employee: null,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/staff');
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    }
  };

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAdd = () => setShowAddForm(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/staff', { ...newEmployee, status: 'Active' });
      fetchEmployees();
    } catch (error) {
      console.error('Failed to add staff:', error);
    }
    setNewEmployee({ name: '', role: '', email: '', contact: '' });
    setShowAddForm(false);
  };

  const handleCancel = () => setShowAddForm(false);

  const toggleStatus = async (id) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    try {
      await axios.put(`/api/staff/${id}`, {
        ...employee,
        status: employee.status === 'Active' ? 'Suspended' : 'Active'
      });
      fetchEmployees();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`/api/staff/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to delete staff:', error);
    }
  };

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
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <List employees={employees} confirmAction={confirmAction} />
          <div className="flex justify-start mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleAdd}>
              Add New Employee
            </button>
          </div>
        </div>
        <AddModal
          showAddForm={showAddForm}
          newEmployee={newEmployee}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
        <ConfirmModal
          confirmModal={confirmModal}
          handleConfirm={handleConfirm}
          handleCancelConfirm={handleCancelConfirm}
        />
      </div>
    </div>
  );
};

export default StaffManagement;
