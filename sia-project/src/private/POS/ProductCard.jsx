//src/private/POS/ProductCard.jsx
import React from "react";
import reactLogo from "../../assets/react.svg"; // Fallback image

const ProductCard = ({ product, onSelect }) => {
  return (
    <div
      className="bg-white border rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer transition"
      onClick={() => onSelect(product)}
    >
      <img
        src={product.image || reactLogo}
        alt={product.name}
        className="w-full h-28 object-contain rounded mb-2"
      />
      <h3 className="font-semibold text-gray-800 text-base">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-1">{product.category}</p>
      <p className="font-bold text-green-600 text-sm">₱{product.price.toLocaleString()}</p>
    </div>
  );
};

export default ProductCard;
