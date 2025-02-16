// src/private/Inventory/InventoryDashboard.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import AdjustStockModal from "./AdjustStockModal";
import RemoveProductModal from "./RemoveProductModal";

const InventoryDashboard = () => {
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol", form: "Tablet", strength: "500mg", batch: "B1234", stock: 50, expiry: "2025-06-10" },
    { id: 2, name: "Amoxicillin", form: "Capsule", strength: "250mg", batch: "A5678", stock: 30, expiry: "2025-08-15" },
    { id: 3, name: "Cough Syrup", form: "Syrup", strength: "100mg/5ml", batch: "C9012", stock: 20, expiry: "2025-07-20" },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Inventory Management</h1>

        {/* Table Container - Matches Staff Management */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <ProductTable 
            medicines={medicines} 
            searchQuery={searchQuery} 
            onEdit={(medicine) => {
              setSelectedMedicine(medicine);
              setIsEditModalOpen(true);
            }}
            onAdjustStock={(medicine) => {
              setSelectedMedicine(medicine);
              setIsAdjustModalOpen(true);
            }}
            onRemove={(medicine) => {
              setSelectedMedicine(medicine);
              setIsRemoveModalOpen(true);
            }}
          />

          {/* Button Container - Same Placement as Staff Management */}
          <div className="flex justify-start mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Modals */}
        {isAddModalOpen && (
          <AddProductModal onClose={() => setIsAddModalOpen(false)} onSave={(newMed) => setMedicines([...medicines, { id: medicines.length + 1, ...newMed }])} />
        )}
        {isEditModalOpen && selectedMedicine && (
          <EditProductModal medicine={selectedMedicine} onClose={() => setIsEditModalOpen(false)} onSave={(updatedMed) => setMedicines(medicines.map((med) => (med.id === updatedMed.id ? updatedMed : med)))} />
        )}
        {isAdjustModalOpen && selectedMedicine && (
          <AdjustStockModal medicine={selectedMedicine} onClose={() => setIsAdjustModalOpen(false)} onSave={(updatedMed) => setMedicines(medicines.map((med) => (med.id === updatedMed.id ? updatedMed : med)))} />
        )}
        {isRemoveModalOpen && selectedMedicine && (
          <RemoveProductModal medicine={selectedMedicine} onClose={() => setIsRemoveModalOpen(false)} onConfirm={() => setMedicines(medicines.filter((med) => med.id !== selectedMedicine.id))} />
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
