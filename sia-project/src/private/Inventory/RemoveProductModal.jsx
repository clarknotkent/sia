// src/private/Inventory/RemoveProductModal.jsx

import React from "react";

const RemoveProductModal = ({ product, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96 text-gray-900">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to remove <strong>{product.genericName}</strong> from inventory?</p>

        <div className="flex justify-end mt-4 space-x-2">
          <button className="bg-red-500 text-white px-6 py-2 rounded shadow" onClick={onConfirm}>
            Remove
          </button>
          <button className="bg-gray-500 text-white px-6 py-2 rounded shadow" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveProductModal;
