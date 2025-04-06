// src/private/Inventory/InventoryDashboard.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import RestockProductModal from "./RestockProductModal";
import ViewProductModal from "./ViewProductModal";
import Pagination from "../../components/Pagination";

const InventoryDashboard = () => {
  const [products, setProducts] = useState([
    {
      id: "Paracetamol-Biogesic-Tablet",
      genericName: "Paracetamol",
      brandName: "Biogesic",
      unitOfMeasurement: "Tablet",
      packing: "Blister Pack",
      lotNum: "LOT-001",
      expiryDate: "2025-12-31",
      inventory: {
        stockLevel: 50,
        reservedStock: 0,
        thresholdLevel: 5,
        lastDateUpdated: "2024-04-01",
      },
    },
    {
      id: "Amoxicillin-Amoxil-Capsule",
      genericName: "Amoxicillin",
      brandName: "Amoxil",
      unitOfMeasurement: "Capsule",
      packing: "Bottle",
      lotNum: "LOT-002",
      expiryDate: "2026-03-15",
      inventory: {
        stockLevel: 25,
        reservedStock: 0,
        thresholdLevel: 5,
        lastDateUpdated: "2024-04-02",
      },
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    (product.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (unitFilter ? product.unitOfMeasurement === unitFilter : true)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Inventory Management</h1>

        <div className="bg-white p-6 rounded-lg shadow-md border">
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
            onRemove={(product) => {
              const confirmDelete = window.confirm(`Are you sure you want to remove "${product.genericName}"?`);
              if (confirmDelete) {
                setProducts(products.filter((p) => p.id !== product.id));
              }
            }}
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
            onSave={(newProduct) =>
              setProducts([
                ...products,
                {
                  id: `custom-${Date.now()}`,
                  ...newProduct,
                  inventory: {
                    stockLevel: newProduct.stock,
                    reservedStock: 0,
                    thresholdLevel: 5,
                    lastDateUpdated: new Date().toISOString().split("T")[0],
                  },
                },
              ])
            }
          />
        )}

        {isRestockModalOpen && (
          <RestockProductModal
            onClose={() => setIsRestockModalOpen(false)}
            onSave={(restockProduct) =>
              setProducts([
                ...products,
                {
                  id: `restock-${Date.now()}`,
                  ...restockProduct,
                  inventory: {
                    stockLevel: restockProduct.stock,
                    reservedStock: 0,
                    thresholdLevel: 5,
                    lastDateUpdated: new Date().toISOString().split("T")[0],
                  },
                },
              ])
            }
          />
        )}

        {isEditModalOpen && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedProduct) =>
              setProducts(products.map((prod) =>
                prod.id === updatedProduct.id ? updatedProduct : prod
              ))
            }
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
