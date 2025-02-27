// src/private/Inventory/EditProductModal.jsx

import React, { useState } from "react";

const EditProductModal = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(editedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-900 flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-center">Edit Product</h2>

        <table className="w-full border-collapse border border-gray-300 mb-4 flex-grow">
          <tbody>
            <tr>
              <td className="border px-4 py-2">Generic Name</td>
              <td>
                <input
                  type="text"
                  name="genericName"
                  value={editedProduct.genericName}
                  onChange={handleChange}
                  className="w-full p-2 border text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Brand Name</td>
              <td>
                <input
                  type="text"
                  name="brandName"
                  value={editedProduct.brandName}
                  onChange={handleChange}
                  className="w-full p-2 border text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Unit of Measurement</td>
              <td>
                <select
                  name="unitOfMeasurement"
                  value={editedProduct.unitOfMeasurement}
                  onChange={handleChange}
                  className="w-full p-2 border text-gray-900 bg-white"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Syringe">Syringe</option>
                  <option value="Box">Box</option>
                  <option value="Ampoule">Ampoule</option>
                  <option value="Other">Other</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Packing</td>
              <td>
                <input
                  type="text"
                  name="packing"
                  value={editedProduct.packing}
                  onChange={handleChange}
                  className="w-full p-2 border text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Lot Number</td>
              <td>
                <input
                  type="text"
                  name="lotNum"
                  value={editedProduct.lotNum}
                  onChange={handleChange}
                  className="w-full p-2 border text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Stock Quantity</td>
              <td>
                <input
                  type="number"
                  name="stock"
                  value={editedProduct.inventory.stockLevel}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      inventory: {
                        ...editedProduct.inventory,
                        stockLevel: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Expiry Date</td>
              <td>
                <input
                  type="date"
                  name="expiryDate"
                  value={editedProduct.expiryDate}
                  onChange={handleChange}
                  className="w-full p-2 border text-gray-900 bg-white"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end mt-4 space-x-2">
          <button className="bg-green-500 text-white px-6 py-2 rounded shadow" onClick={handleSave}>Save</button>
          <button className="bg-red-500 text-white px-6 py-2 rounded shadow" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
