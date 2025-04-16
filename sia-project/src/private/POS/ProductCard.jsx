// src/private/POS/ProductCard.jsx
import React from "react";
import fallbackImage from "../../assets/react.svg";

const ProductCard = ({ product, onSelect }) => {
  return (
    <div
      className="bg-white border rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer transition"
      onClick={() => onSelect(product)}
    >
      <img
        src={product.image || fallbackImage}
        alt={product.genericName}
        className="w-full h-28 object-contain rounded mb-2"
      />

      <div className="space-y-1 text-sm text-gray-800">
        <h3 className="font-semibold text-base">{product.genericName}</h3>
        <p className="text-xs text-gray-500">{product.brandName}</p>
        <p className="text-xs text-gray-500">{product.unitOfMeasurement}</p>
        <p className="font-bold text-green-600 text-sm">₱{product.price?.toLocaleString() || "N/A"}</p>
      </div>
    </div>
  );
};

export default ProductCard;
