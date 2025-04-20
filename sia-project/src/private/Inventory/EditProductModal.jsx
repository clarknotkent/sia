import { useState, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const EditProductModal = ({ product, onClose, refreshInventory }) => {
  const [form, setForm] = useState({
    genericName: product.genericName,
    brandName: product.brandName,
    unitOfMeasurement: product.unitOfMeasurement,
    packing: product.packing,
    lotNum: product.lotNum,
    expiryDate: product.expiryDate,
    stockLevel: product.inventory?.stockLevel || 0,
    price: product.price || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleSave = async () => {
    if (!product?.id) {
      console.error("Product ID is missing!");
      alert("Cannot update: Product ID is missing.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("genericName", form.genericName);
      formData.append("brandName", form.brandName);
      formData.append("unitOfMeasurement", form.unitOfMeasurement);
      formData.append("packing", form.packing);
      formData.append("lotNum", form.lotNum);
      formData.append("expiryDate", form.expiryDate);
      formData.append("stockLevel", form.stockLevel);
      formData.append("price", form.price);
      formData.append("thresholdLevel", 5); // default
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`/api/inventory/${product.id}`, formData);
      refreshInventory();
      onClose();
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-900">
        <h2 className="text-xl font-bold text-center mb-4">Edit Product</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Generic Name</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="genericName"
                  value={form.genericName}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Brand Name</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Unit</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="unitOfMeasurement"
                  value={form.unitOfMeasurement}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Packing</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="packing"
                  value={form.packing}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Lot Number</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="lotNum"
                  value={form.lotNum}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Stock</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  name="stockLevel"
                  value={form.stockLevel}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Expiry Date</td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Price</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Image</td>
              <td className="border px-4 py-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="w-full"
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
EditProductModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    genericName: PropTypes.string.isRequired,
    brandName: PropTypes.string.isRequired,
    unitOfMeasurement: PropTypes.string.isRequired,
    packing: PropTypes.string.isRequired,
    lotNum: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
    inventory: PropTypes.shape({
      stockLevel: PropTypes.number,
    }),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  refreshInventory: PropTypes.func.isRequired,
};

export default EditProductModal;
