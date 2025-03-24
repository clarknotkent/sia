import React, { useState } from "react";
import Sidebar from "../Sidebar";
import CartPanel from "./CartPanel";
import ProductGrid from "./ProductGrid";
import Pagination from "../../components/Pagination";

const POSDashboard = () => {
  const allProducts = [
    { id: 1, name: "Paracetamol", category: "Tablet", price: 10, image: "/default-product.svg" },
    { id: 2, name: "Cough Syrup", category: "Syrup", price: 120, image: "/default-product.svg" },
    { id: 3, name: "Amoxicillin", category: "Capsule", price: 18, image: "/default-product.svg" },
    { id: 4, name: "Ibuprofen", category: "Tablet", price: 25, image: "/default-product.svg" },
    { id: 5, name: "Vitamin C", category: "Supplement", price: 35, image: "/default-product.svg" },
    { id: 6, name: "Salbutamol", category: "Inhaler", price: 90, image: "/default-product.svg" },
  ];

  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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

  const handleCartUpdate = (updatedCart) => {
    setCartItems(updatedCart);
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Point of Sale (Work in Progress)</h1>

        <div className="flex gap-6">
          {/* Left: Product Display */}
          <div className="flex-1 bg-white p-4 rounded shadow border">
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
              </select>
            </div>

            {/* Product Grid */}
            <ProductGrid products={paginatedProducts} onSelect={handleProductSelect} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Right: Cart */}
          <div className="w-[350px]">
            <CartPanel cartItems={cartItems} onCartUpdate={handleCartUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;
