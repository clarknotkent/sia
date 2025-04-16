import React from "react";

const ViewProductModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-center">Product Details</h2>

        {/* Image Display */}
        {product.image && (
          <div className="flex justify-center mb-4">
            <img
              src={product.image}
              alt={product.genericName}
              className="w-48 h-48 object-cover rounded border"
            />
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-2 text-sm">
          <p><strong>Product ID:</strong> {product.id}</p>
          <p><strong>Generic Name:</strong> {product.genericName}</p>
          <p><strong>Brand Name:</strong> {product.brandName}</p>
          <p><strong>Unit:</strong> {product.unitOfMeasurement}</p>
          <p><strong>Packing:</strong> {product.packing}</p>
          <p><strong>Lot Number:</strong> {product.lotNum}</p>
          <p><strong>Expiry Date:</strong> {product.expiryDate}</p>
          <p><strong>Price:</strong> {product.price ? `₱${Number(product.price).toFixed(2)}` : "—"}</p>
        </div>

        <hr className="my-4" />

        {/* Inventory Info */}
        <div className="space-y-2 text-sm">
          <p><strong>Stock Level:</strong> {product.inventory?.stockLevel ?? 0}</p>
          <p><strong>Reserved Stock:</strong> {product.inventory?.reservedStock ?? 0}</p>
          <p><strong>Threshold Level:</strong> {product.inventory?.thresholdLevel ?? 0}</p>
          <p><strong>Last Updated:</strong> {product.inventory?.lastDateUpdated}</p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
