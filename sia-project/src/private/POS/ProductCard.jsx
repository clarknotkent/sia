// src/private/POS/ProductCard.jsx
import fallbackImage from "../../assets/react.svg";
import PropTypes from "prop-types";

const ProductCard = ({ product, onSelect }) => {
  console.log("ProductCard rendered with product:", product);

  return (
    <div
      className="bg-white border rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer transition"
      onClick={() => onSelect(product)}
    >
      <img
        src={product.image || fallbackImage}
        alt={product.genericName}
        className="w-full h-28 object-contain rounded mb-2"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackImage;
        }}
      />

      <div className="space-y-1 text-sm text-gray-800">
        <h3 className="font-semibold text-base">{product.genericName}</h3>
        <p className="text-xs text-gray-500">{product.brandName}</p>
        <p className="text-xs text-gray-500">{product.unitOfMeasurement}</p>
        <p className="font-bold text-green-600 text-sm">
          ₱{product.price?.toLocaleString() || "N/A"}
        </p>
        <p
          className={`text-sm font-medium ${
            product.stockLevel === 0
              ? "text-gray-500 italic"
              : product.stockLevel <= 10
              ? "text-red-600"
              : product.stockLevel <= 25
              ? "text-yellow-600"
              : "text-gray-800"
          }`}
        >
          {product.stockLevel === 0 ? (
            <>
              <span className="mr-1">⛔️</span>— No Stock
            </>
          ) : (
            <>
              {product.stockLevel <= 10 && <span className="mr-1">❗</span>}
              {product.stockLevel > 10 && product.stockLevel <= 25 && (
                <span className="mr-1">⚠️</span>
              )}
              Stock: {product.stockLevel}
            </>
          )}
        </p>
      </div>
    </div>
  );
};
ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string,
    genericName: PropTypes.string.isRequired,
    brandName: PropTypes.string,
    unitOfMeasurement: PropTypes.string,
    price: PropTypes.number,
    stockLevel: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProductCard;
