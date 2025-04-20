import { useState, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const AddProductModal = ({ onClose, refreshInventory }) => {
  const [product, setProduct] = useState({
    genericName: "",
    brandName: "",
    unitOfMeasurement: "",
    packing: "",
    lotNum: "",
    stock: 0,
    expiryDate: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    if (
      !product.genericName ||
      !product.brandName ||
      !product.unitOfMeasurement ||
      !product.packing ||
      !product.lotNum ||
      product.stock <= 0 ||
      !product.expiryDate ||
      !product.price
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("genericName", product.genericName);
      formData.append("brandName", product.brandName);
      formData.append("unitOfMeasurement", product.unitOfMeasurement);
      formData.append("packing", product.packing);
      formData.append("lotNum", product.lotNum);
      formData.append("stockLevel", product.stock);
      formData.append("expiryDate", product.expiryDate);
      formData.append("price", product.price);
      formData.append("thresholdLevel", 5);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("/api/inventory", formData);
      refreshInventory();
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-900">
        <h2 className="text-xl font-bold text-center mb-4">Add New Product</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Generic Name</td>
              <td className="border px-4 py-2">
                <input type="text" name="genericName" value={product.genericName} onChange={handleChange} className="w-full border px-2 py-1 text-gray-900 bg-white" />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Brand Name</td>
              <td className="border px-4 py-2">
                <input type="text" name="brandName" value={product.brandName} onChange={handleChange} className="w-full border px-2 py-1 text-gray-900 bg-white" />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Unit</td>
              <td className="border px-4 py-2">
                <select name="unitOfMeasurement" value={product.unitOfMeasurement} onChange={handleChange} className="w-full border px-2 py-1 text-gray-900 bg-white">
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
                <input type="text" name="packing" value={product.packing} onChange={handleChange} className="w-full border px-2 py-1 text-gray-900 bg-white" />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Lot Number</td>
              <td className="border px-4 py-2">
                <input type="text" name="lotNum" value={product.lotNum} onChange={handleChange} className="w-full border px-2 py-1 text-gray-900 bg-white" />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Stock</td>
              <td className="border px-4 py-2">
                <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full border px-2 py-1 text-gray-900 bg-white" />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Expiry Date</td>
              <td className="border px-4 py-2">
                <input type="date" name="expiryDate" value={product.expiryDate} onChange={handleChange} className="w-full border px-2 py-1 text-gray-900 bg-white" />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Price</td>
              <td className="border px-4 py-2">
                <input type="number" name="price" step="0.01" value={product.price} onChange={handleChange} className="w-full border px-2 py-1 text-gray-900 bg-white" />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Image</td>
              <td className="border px-4 py-2">
                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="w-full" />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600" onClick={handleSave}>
            Save
          </button>
          <button className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
AddProductModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshInventory: PropTypes.func.isRequired,
};

export default AddProductModal;
