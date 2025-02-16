// src/private/Inventory/ProductTable.jsx
import React from "react";

const ProductTable = ({ medicines, searchQuery, onEdit, onAdjustStock, onRemove }) => {
  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200 text-gray-800 font-semibold">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Medicine</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Form</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Strength</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Batch No.</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Stock</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Expiry Date</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedicines.map((med, index) => (
            <tr
              key={med.id}
              className={`text-gray-900 text-center ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="border border-gray-300 px-4 py-2 text-left">{med.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{med.form}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{med.strength}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{med.batch}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{med.stock}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{med.expiry}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition" onClick={() => onEdit(med)}>Edit</button>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition" onClick={() => onAdjustStock(med)}>Adjust Stock</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onClick={() => onRemove(med)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
