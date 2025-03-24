//src/private/POS/POSDashboard.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import CartPanel from "./CartPanel";
import ProductGrid from "./ProductGrid";
import Pagination from "../../components/Pagination";
import ReceiptModal from "./ReceiptModal"; // ✅ New modal import

const POSDashboard = () => {
  const allProducts = [
    { id: 1, name: "Paracetamol", category: "Tablet", price: 10, image: "/default-product.svg" },
    { id: 2, name: "Cough Syrup", category: "Syrup", price: 120, image: "/default-product.svg" },
    { id: 3, name: "Amoxicillin", category: "Capsule", price: 18, image: "/default-product.svg" },
    { id: 4, name: "Ibuprofen", category: "Tablet", price: 25, image: "/default-product.svg" },
    { id: 5, name: "Vitamin C", category: "Supplement", price: 35, image: "/default-product.svg" },
    { id: 6, name: "Salbutamol", category: "Inhaler", price: 90, image: "/default-product.svg" },
    { id: 7, name: "Cetirizine", category: "Tablet", price: 12, image: "/default-product.svg" },
    { id: 8, name: "Loratadine", category: "Tablet", price: 15, image: "/default-product.svg" },
    { id: 9, name: "Hydrocortisone", category: "Cream", price: 50, image: "/default-product.svg" },
    { id: 10, name: "Omeprazole", category: "Capsule", price: 30, image: "/default-product.svg" },
    { id: 11, name: "Zinc Sulfate", category: "Supplement", price: 20, image: "/default-product.svg" },
    { id: 12, name: "Multivitamins", category: "Supplement", price: 40, image: "/default-product.svg" },
  ];

  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReceiptModal, setShowReceiptModal] = useState(false); // ✅ Show/hide receipt modal

  const pageSize = 15; // 5 columns x 3 rows

  const filteredProducts = allProducts.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter ? product.category === categoryFilter : true)
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleProductSelect = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, discount: 0 }]);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Point of Sale (Walk-in Customers)
        </h1>

        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          {/* Left: Product Display */}
          <div className="flex-1 bg-white p-4 rounded shadow border overflow-hidden flex flex-col">
            {/* Filters */}
            <div className="flex justify-between items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by name or category"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border p-2 rounded w-full bg-white text-black"
              />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border p-2 rounded bg-white text-black"
              >
                <option value="">All Categories</option>
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Capsule">Capsule</option>
                <option value="Supplement">Supplement</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Cream">Cream</option>
              </select>
            </div>

            {/* Product Grid (fixed height) */}
            <div className="flex-1 overflow-auto max-h-[660px]">
              <ProductGrid products={paginatedProducts} onSelect={handleProductSelect} />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Right: Cart */}
          <div className="w-[350px] h-full overflow-y-auto">
            <CartPanel
              cartItems={cartItems}
              onUpdateItem={(index, field, value) => {
                const updatedCart = [...cartItems];
                updatedCart[index][field] = value;
                setCartItems(updatedCart);
              }}
              onRemoveItem={(index) => {
                const updatedCart = [...cartItems];
                updatedCart.splice(index, 1);
                setCartItems(updatedCart);
              }}
              onHold={() => {
                console.log("Order held:", cartItems);
                alert("Order placed on hold!");
              }}
              onProceed={() => {
                setShowReceiptModal(true); // ✅ Open receipt modal
              }}
              onClear={() => setCartItems([])}
            />
          </div>
        </div>
      </div>

      {/* ✅ Receipt Modal */}
      {showReceiptModal && (
        <ReceiptModal
          cartItems={cartItems}
          onClose={() => setShowReceiptModal(false)}
          onClear={() => setCartItems([])} // ✅ Clear cart after printing
        />
        )}

    </div>
  );
};

export default POSDashboard;
