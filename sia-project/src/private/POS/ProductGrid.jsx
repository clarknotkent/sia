// src/private/POS/ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onSelect }) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default ProductGrid;
