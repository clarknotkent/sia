// src/private/Inventory/InventoryDashboard.jsx

import React, { useState } from "react";
import Sidebar from "../Sidebar";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import AdjustStockModal from "./AdjustStockModal";
import RemoveProductModal from "./RemoveProductModal";
import Pagination from "../../components/Pagination"; // Reuse the existing Pagination component

const InventoryDashboard = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            genericName: "Paracetamol",
            brandName: "Biogesic",
            unitOfMeasurement: "Tablet",
            packing: "Blister Pack",
            lotNum: "B1234",
            expiryDate: "2025-06-10",
            inventory: {
                stockLevel: 50,
                reservedStock: 5,
                thresholdLevel: 10,
                lastDateUpdated: "2024-03-01",
            },
        },
        {
            id: 2,
            genericName: "Amoxicillin",
            brandName: "Amoxil",
            unitOfMeasurement: "Capsule",
            packing: "Bottle",
            lotNum: "A5678",
            expiryDate: "2025-08-15",
            inventory: {
                stockLevel: 30,
                reservedStock: 2,
                thresholdLevel: 5,
                lastDateUpdated: "2024-02-28",
            },
        },
        {
            id: 3,
            genericName: "Cough Syrup",
            brandName: "Robitussin",
            unitOfMeasurement: "Syrup",
            packing: "Bottle",
            lotNum: "C9012",
            expiryDate: "2025-07-20",
            inventory: {
                stockLevel: 20,
                reservedStock: 3,
                thresholdLevel: 8,
                lastDateUpdated: "2024-02-27",
            },
        },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [unitFilter, setUnitFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Filter and paginate products
    const filteredProducts = products.filter(product =>
        (product.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.brandName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (unitFilter ? product.unitOfMeasurement === unitFilter : true)
    );

    const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    return (
        <div className="flex h-screen w-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Inventory Management</h1>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                    {/* Search, Filter, and Add Button */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search by Generic or Brand Name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border p-2 rounded bg-white text-gray-800"
                                style={{ width: '400px' }}
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
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            + Add Product
                        </button>
                    </div>

                    {/* Product Table */}
                    <ProductTable
                        products={paginatedProducts}
                        searchQuery={searchQuery}
                        onEdit={(product) => {
                            setSelectedProduct(product);
                            setIsEditModalOpen(true);
                        }}
                        onAdjustStock={(product) => {
                            setSelectedProduct(product);
                            setIsAdjustModalOpen(true);
                        }}
                        onRemove={(product) => {
                            setSelectedProduct(product);
                            setIsRemoveModalOpen(true);
                        }}
                    />

                    {/* Pagination */}
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
                                    id: products.length + 1,
                                    ...newProduct,
                                    inventory: {
                                        stockLevel: 0,
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
                {isAdjustModalOpen && selectedProduct && (
                    <AdjustStockModal
                        product={selectedProduct}
                        onClose={() => setIsAdjustModalOpen(false)}
                        onSave={(updatedProduct) =>
                            setProducts(products.map((prod) =>
                                prod.id === updatedProduct.id ? updatedProduct : prod
                            ))
                        }
                    />
                )}
                {isRemoveModalOpen && selectedProduct && (
                    <RemoveProductModal
                        product={selectedProduct}
                        onClose={() => setIsRemoveModalOpen(false)}
                        onConfirm={() =>
                            setProducts(products.filter((prod) => prod.id !== selectedProduct.id))
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default InventoryDashboard;
