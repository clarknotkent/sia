//src/private/Inventory/EditProductModal.jsx
import React, { useState } from "react";

const EditProductModal = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "stock") {
      setEditedProduct({
        ...editedProduct,
        inventory: {
          ...editedProduct.inventory,
          stockLevel: value,
        },
      });
    } else {
      setEditedProduct({ ...editedProduct, [name]: value });
    }
  };

  const handleSave = () => {
    onSave(editedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-900">
        <h2 className="text-xl font-bold text-center mb-4">Edit Product</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium w-1/3">Generic Name</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="genericName"
                  value={editedProduct.genericName}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Brand Name</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="brandName"
                  value={editedProduct.brandName}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Unit</td>
              <td className="border px-4 py-2">
                <select
                  name="unitOfMeasurement"
                  value={editedProduct.unitOfMeasurement}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 text-gray-900 bg-white"
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
              <td className="border px-4 py-2 font-medium">Packing</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="packing"
                  value={editedProduct.packing}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Lot Number</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="lotNum"
                  value={editedProduct.lotNum}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Stock</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  name="stock"
                  value={editedProduct.inventory?.stockLevel}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Expiry Date</td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  name="expiryDate"
                  value={editedProduct.expiryDate}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 text-gray-900 bg-white"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
