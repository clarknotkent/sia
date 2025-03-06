import React, { useState } from 'react';

const AddSupplierModal = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        supplierID: '',
        name: '',
        contactPerson: '',
        contactNumber: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onAdd(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Add Supplier</h2>
                <input className="border p-2 w-full mb-2" name="supplierID" placeholder="Supplier ID" onChange={handleChange} />
                <input className="border p-2 w-full mb-2" name="name" placeholder="Supplier Name" onChange={handleChange} />
                <input className="border p-2 w-full mb-2" name="contactPerson" placeholder="Contact Person" onChange={handleChange} />
                <input className="border p-2 w-full mb-4" name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
                <div className="flex justify-end gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Add</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddSupplierModal;
