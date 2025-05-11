import PropTypes from "prop-types";

const ProductTable = ({ products = [], searchQuery = "", onView, onEdit, onRemove }) => {
  const filteredProducts = Array.isArray(products)
    ? products.filter((prod) =>
        prod.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="w-full">
      <table className="w-full border-collapse border border-gray-300 text-center">
        <thead className="bg-gray-200 text-gray-800 font-semibold">
          <tr className="text-center">
            <th className="border px-4 py-2 text-center">Product ID</th>
            <th className="border px-4 py-2 text-center">Generic Name</th>
            <th className="border px-4 py-2 text-center">Brand Name</th>
            <th className="border px-4 py-2 text-center">Unit</th>
            <th className="border px-4 py-2 text-center">Price</th>
            <th className="border px-4 py-2 text-center">Stock</th>
            <th className="border px-4 py-2 text-center">Expiry</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod, index) => {
              const stock = prod.inventory?.stockLevel ?? 0;

              return (
                <tr
                  key={prod.id}
                  className={`text-center text-gray-800 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="border px-4 py-2 text-center">{prod.id}</td>
                  <td className="border px-4 py-2 text-center">{prod.genericName}</td>
                  <td className="border px-4 py-2 text-center">{prod.brandName}</td>
                  <td className="border px-4 py-2 text-center">{prod.unitOfMeasurement}</td>
                  <td className="border px-4 py-2 text-center">
                    {prod.price ? `₱${Number(prod.price).toFixed(2)}` : "—"}
                  </td>
                  <td
                    className={`border px-4 py-2 font-semibold text-center ${
                      stock === 0
                        ? "text-gray-500 italic"
                        : stock <= 10
                        ? "text-red-600"
                        : stock <= 25
                        ? "text-yellow-600"
                        : ""
                    }`}
                  >
                    {stock === 0 ? (
                      <>
                        <span className="mr-1">⛔️</span>— No Stock
                      </>
                    ) : (
                      <>
                        {stock <= 10 && <span className="mr-1">❗</span>}
                        {stock > 10 && stock <= 25 && <span className="mr-1">⚠️</span>}
                        {stock}
                      </>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">{prod.expiryDate || "—"}</td>
                  <td className="border px-4 py-2 text-center space-x-1">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => onView(prod)}
                    >
                      View
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => onEdit(prod)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => onRemove(prod)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-gray-500 py-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

ProductTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      genericName: PropTypes.string,
      brandName: PropTypes.string,
      unitOfMeasurement: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      expiryDate: PropTypes.string,
      inventory: PropTypes.shape({
        stockLevel: PropTypes.number,
      }),
    })
  ),
  searchQuery: PropTypes.string,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ProductTable;
