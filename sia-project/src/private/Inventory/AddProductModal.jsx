// src/private/Inventory/AddProductModal.jsx
import React, { useState } from "react";

const AddProductModal = ({ onClose, onSave }) => {
  const [medicine, setMedicine] = useState({
    name: "",
    form: "",
    strength: "",
    batch: "",
    stock: 0,
    expiry: "",
  });

  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!medicine.name || !medicine.form || !medicine.strength || !medicine.batch || medicine.stock <= 0 || !medicine.expiry) return;
    onSave({ ...medicine, stock: Number(medicine.stock) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-900 flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-center">Add New Product</h2>

        <table className="w-full border-collapse border border-gray-300 mb-4 flex-grow">
          <tbody>
            <tr><td className="border px-4 py-2">Medicine Name</td><td><input type="text" name="name" value={medicine.name} onChange={handleChange} className="w-full p-2 border text-gray-900 bg-white" /></td></tr>
            <tr><td className="border px-4 py-2">Dosage Form</td><td><input type="text" name="form" value={medicine.form} onChange={handleChange} className="w-full p-2 border text-gray-900 bg-white" /></td></tr>
            <tr><td className="border px-4 py-2">Strength</td><td><input type="text" name="strength" value={medicine.strength} onChange={handleChange} className="w-full p-2 border text-gray-900 bg-white" /></td></tr>
            <tr><td className="border px-4 py-2">Batch Number</td><td><input type="text" name="batch" value={medicine.batch} onChange={handleChange} className="w-full p-2 border text-gray-900 bg-white" /></td></tr>
            <tr><td className="border px-4 py-2">Stock Quantity</td><td><input type="number" name="stock" value={medicine.stock} onChange={handleChange} className="w-full p-2 border text-gray-900 bg-white" /></td></tr>
            <tr><td className="border px-4 py-2">Expiry Date</td><td><input type="date" name="expiry" value={medicine.expiry} onChange={handleChange} className="w-full p-2 border text-gray-900 bg-white" /></td></tr>
          </tbody>
        </table>

        {/* Button Container with Proper Alignment */}
        <div className="flex justify-end mt-4 space-x-2">
          <button className="bg-green-500 text-white px-6 py-2 rounded shadow" onClick={handleSave}>Save</button>
          <button className="bg-red-500 text-white px-6 py-2 rounded shadow" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
