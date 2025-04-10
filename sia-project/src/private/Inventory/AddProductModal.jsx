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
    if (
      !product.genericName ||
      !product.brandName ||
      !product.unitOfMeasurement ||
      !product.packing ||
      !product.lotNum ||
      product.stock <= 0 ||
      !product.expiryDate
    )
      return;

    onSave({ ...product, stock: Number(product.stock) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-900">
        <h2 className="text-xl font-bold text-center mb-4">Add New Product</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium w-1/3">Generic Name</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="genericName"
                  value={product.genericName}
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
                  value={product.brandName}
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
                  value={product.unitOfMeasurement}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 text-gray-900 bg-white"
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
              <td className="border px-4 py-2 font-medium">Packing</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="packing"
                  value={product.packing}
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
                  value={product.lotNum}
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
                  value={product.stock}
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
                  value={product.expiryDate}
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

export default AddProductModal;
