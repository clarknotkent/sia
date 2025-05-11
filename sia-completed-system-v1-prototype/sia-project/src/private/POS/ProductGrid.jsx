// src/private/POS/ProductGrid.jsx
import ProductCard from "./ProductCard";
import PropTypes from "prop-types";

const ProductGrid = ({ products, onSelect }) => {
  console.log("ProductGrid re-rendered with products:", products);

  return (
    <div className="grid grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </div>
  );
};
ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProductGrid;
