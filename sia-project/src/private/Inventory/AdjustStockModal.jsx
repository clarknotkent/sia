// src/private/Inventory/AdjustStockModal.jsx
import React, { useState } from "react";

const AdjustStockModal = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState("");
  const [reason, setReason] = useState("");

  const handleSave = () => {
    if (quantity <= 0 || !adjustmentType) return;

    let newStock = product.inventory.stockLevel;
    if (adjustmentType === "restock") {
      newStock += Number(quantity);
    } else {
      newStock -= Number(quantity);
      if (newStock < 0) newStock = 0; // Prevent negative stock
    }

    onSave({
      ...product,
      inventory: { ...product.inventory, stockLevel: newStock },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-900 flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-center">
          Adjust Stock for {product.genericName}
        </h2>

        <table className="w-full border-collapse border border-gray-300 mb-4 flex-grow">
          <tbody>
            <tr>
              <td className="border px-4 py-2">Adjustment Type</td>
              <td>
                <select
                  className="w-full p-2 border text-gray-900 bg-white"
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value)}
                >
                  <option value="">Select Adjustment Type</option>
                  <option value="restock">Restock</option>
                  <option value="dispense">Dispense</option>
                  <option value="damage">Damaged</option>
                  <option value="expired">Expired</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Quantity</td>
              <td>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 border text-gray-900 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Reason (Optional)</td>
              <td>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border text-gray-900 bg-white"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end mt-4 space-x-2">
          <button className="bg-green-500 text-white px-6 py-2 rounded shadow" onClick={handleSave}>
            Save
          </button>
          <button className="bg-red-500 text-white px-6 py-2 rounded shadow" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustStockModal;
