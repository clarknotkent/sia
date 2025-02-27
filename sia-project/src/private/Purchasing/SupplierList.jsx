// src/private/Purchasing/SupplierList.jsx

import { useState } from "react";

const SupplierList = () => {
  const [suppliers] = useState([
    { id: 1, name: "Supplier A", category: "Medicine", location: "City 1", priceRange: "$$" },
    { id: 2, name: "Supplier B", category: "Equipment", location: "City 2", priceRange: "$$$" },
  ]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Supplier List</h3>
      <table className="w-full border text-gray-900">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Location</th>
            <th className="p-2">Price Range</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-b">
              <td className="p-2">{supplier.name}</td>
              <td className="p-2">{supplier.category}</td>
              <td className="p-2">{supplier.location}</td>
              <td className="p-2">{supplier.priceRange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
