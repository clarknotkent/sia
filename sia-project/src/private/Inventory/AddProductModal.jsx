// src/private/Inventory/AddProductModal.jsx

import React, { useState } from "react";

const AddProductModal = ({ onClose, onSave }) => {
  const [product, setProduct] = useState({
    genericName: "",
    brandName: "",
    unitOfMeasurement: "",
    packing: "",
    lotNum: "",
    stock: 0,
    expiryDate: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!product.genericName || !product.brandName || !product.unitOfMeasurement || !product.packing || !product.lotNum || product.stock <= 0 || !product.expiryDate) return;
    onSave({ ...product, stock: Number(product.stock) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-900 flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-center">Add New Product</h2>

        <table className="w-full border-collapse border border-gray-300 mb-4 flex-grow">
          <tbody>
            <tr>
              <td className="border px-4 py-2">Generic Name</td>
              <td>
                <input
                  type="text"
                  name="genericName"
                  value={product.genericName}
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
                  value={product.brandName}
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
                  value={product.unitOfMeasurement}
                  onChange={handleChange}
                  className="w-full p-2 border text-gray-900 bg-white"
                >
                  <option value="">Select Unit</option>
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
                  value={product.packing}
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
                  value={product.lotNum}
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
                  value={product.stock}
                  onChange={handleChange}
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
                  value={product.expiryDate}
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

export default AddProductModal;
