// src/private/Delivery/DeliveryTable.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../components/Pagination";
import ViewDeliveryModal from "./Modals/ViewDeliveryModal";
import EditDeliveryModal from "./Modals/EditDeliveryModal";

const API_BASE_URL = "/api";

const DeliveryTable = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const pageSize = 5;

  // Fetch deliveries from the backend
  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/delivery`); // ✅ Fetch deliveries from backend
      setDeliveries(res.data); // Update state with fetched deliveries
    } catch (err) {
      console.error("Failed to fetch deliveries:", err);
    }
  };

  useEffect(() => {
    fetchDeliveries(); // Fetch deliveries on component mount
  }, []);

  // Handle deleting a delivery
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this delivery?");
    if (!confirmed) return;
    try {
      await axios.delete(`/api/delivery/${id}`);
      fetchDeliveries();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete delivery.");
    }
  };

  // Handle opening the edit modal
  const handleEditClick = (delivery) => {
    setSelectedDelivery(delivery);
    setShowEditModal(true);
  };

  // Handle saving changes to a delivery
  const handleEditSave = async (updated) => {
    try {
      await axios.put(`/api/delivery/${updated.deliveryID}`, updated);
      setDeliveries(prev => prev.map(d => d.deliveryID === updated.deliveryID ? updated : d));
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to save delivery:", err);
      alert("Edit failed.");
    }
  };

  // Paginate deliveries
  const paginated = deliveries.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(deliveries.length / pageSize);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <table className="w-full border text-sm text-black">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Delivery ID</th>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Driver</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(del => (
            <tr key={del.deliveryID} className="text-center">
              <td className="border p-2">{del.deliveryID}</td>
              <td className="border p-2">{del.orderID}</td>
              <td className="border p-2">{del.customer}</td>
              <td className="border p-2">{del.address}</td>
              <td className="border p-2">{del.driver || 'Unassigned'}</td>
              <td className="border p-2">{del.status}</td>
              <td className="border p-2">{del.date}</td>
              <td className="border p-2 space-x-2 text-center">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedDelivery(del);
                    setShowViewModal(true);
                  }}
                >
                  View
                </button>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  onClick={() => handleEditClick(del)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(del.deliveryID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* View Delivery Modal */}
      {showViewModal && selectedDelivery && (
        <ViewDeliveryModal
          delivery={selectedDelivery}
          onClose={() => setShowViewModal(false)}
          onRefresh={fetchDeliveries}
        />
      )}

      {/* Edit Delivery Modal */}
      {showEditModal && selectedDelivery && (
        <EditDeliveryModal
          delivery={selectedDelivery}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default DeliveryTable;
