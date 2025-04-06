// src/private/Inventory/ProductTable.jsx

import React from "react";

const ProductTable = ({ products = [], searchQuery = "", onView, onEdit, onRemove }) => {
  const filteredProducts = Array.isArray(products)
    ? products.filter((prod) =>
        prod.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="w-full">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200 text-gray-800 font-semibold">
          <tr>
            <th className="border px-4 py-2 text-left">Product ID</th>
            <th className="border px-4 py-2 text-left">Generic Name</th>
            <th className="border px-4 py-2 text-center">Brand Name</th>
            <th className="border px-4 py-2 text-center">Unit</th>
            <th className="border px-4 py-2 text-center">Stock</th>
            <th className="border px-4 py-2 text-center">Expiry</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod, index) => (
              <tr
                key={prod.id}
                className={`text-gray-900 text-center ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="border px-4 py-2 text-left">{prod.id}</td>
                <td className="border px-4 py-2 text-left">{prod.genericName}</td>
                <td className="border px-4 py-2">{prod.brandName}</td>
                <td className="border px-4 py-2">{prod.unitOfMeasurement}</td>
                <td className="border px-4 py-2">{prod.inventory?.stockLevel ?? 0}</td>
                <td className="border px-4 py-2">{prod.expiryDate || "—"}</td>
                <td className="border px-4 py-2 space-x-1">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => onView(prod)}
                  >
                    View
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => onEdit(prod)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => onRemove(prod)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
