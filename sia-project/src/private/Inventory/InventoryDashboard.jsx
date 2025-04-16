import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import RestockProductModal from "./RestockProductModal";
import ViewProductModal from "./ViewProductModal";
import Pagination from "../../components/Pagination";

const InventoryDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [stockLevelFilter, setStockLevelFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/inventory");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUnit = unitFilter ? product.unitOfMeasurement === unitFilter : true;

    const stock = product.inventory?.stockLevel ?? 0;
    const matchesStockLevel =
      stockLevelFilter === "in" ? stock > 25 :
      stockLevelFilter === "low" ? stock > 10 && stock <= 25 :
      stockLevelFilter === "critical" ? stock > 0 && stock <= 10 :
      stockLevelFilter === "none" ? stock === 0 :
      true;

    return matchesSearch && matchesUnit && matchesStockLevel;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const handleRemove = async (product) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove "${product.genericName}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/inventory/${product.id}`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to remove product:", err);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Inventory Management</h1>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Products</h2>

          {/* Search & Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search by Generic or Brand Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-2 rounded bg-white text-gray-800"
                style={{ width: "400px" }}
              />
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="border p-2 rounded bg-white text-gray-800"
              >
                <option value="">All Units</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
              </select>
              <select
                value={stockLevelFilter}
                onChange={(e) => setStockLevelFilter(e.target.value)}
                className="border p-2 rounded bg-white text-gray-800"
              >
                <option value="">All Stocks</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="critical">Critical Stock</option>
                <option value="none">No Stock</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => setIsAddModalOpen(true)}
              >
                + Add Product
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setIsRestockModalOpen(true)}
              >
                ↻ Restock
              </button>
            </div>
          </div>

          {/* Product Table */}
          <ProductTable
            products={paginatedProducts}
            searchQuery={searchQuery}
            onView={(product) => {
              setSelectedProduct(product);
              setIsViewModalOpen(true);
            }}
            onEdit={(product) => {
              setSelectedProduct(product);
              setIsEditModalOpen(true);
            }}
            onRemove={handleRemove}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Modals */}
        {isAddModalOpen && (
          <AddProductModal
            onClose={() => setIsAddModalOpen(false)}
            refreshInventory={fetchProducts}
          />
        )}

        {isRestockModalOpen && (
          <RestockProductModal
            onClose={() => setIsRestockModalOpen(false)}
            originalProduct={selectedProduct}
            refreshInventory={fetchProducts}
          />
        )}

        {isEditModalOpen && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            onClose={() => setIsEditModalOpen(false)}
            refreshInventory={fetchProducts}
          />
        )}

        {isViewModalOpen && selectedProduct && (
          <ViewProductModal
            product={selectedProduct}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
