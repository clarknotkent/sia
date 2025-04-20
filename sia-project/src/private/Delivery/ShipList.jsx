// src/private/Delivery/ShipList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Pagination";
import ViewDeliveryOrderModal from "./Modals/ViewDeliveryOrderModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ShipList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 5;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/orders`);
      const forDeliveryOrders = res.data.filter(
        (o) => o.status === "For Delivery" // ✅ Include all "For Delivery" orders
      );
      setOrders(forDeliveryOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
    fetchOrders();
  };

  const handleDelete = async (orderID) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/orders/orders/${orderID}`);
      alert("Order deleted successfully.");
      fetchOrders();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete order.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    (order.orderID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? order.status === statusFilter : true)
  );

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Orders Ready for Delivery</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded bg-white text-gray-800 w-[400px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Status</option>
            <option value="For Delivery">For Delivery</option>
            <option value="Processing">Processing</option>
          </select>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2 text-right">Total Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            paginatedOrders.map((order) => (
              <tr key={order.orderID} className="hover:bg-gray-100 text-center">
                <td className="border p-2">{order.orderID}</td>
                <td className="border p-2">{order.client?.name}</td>
                <td className="border p-2 text-right">₱{order.totalAmount?.toLocaleString()}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => openModal(order)}
                  >
                    View
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      order.deliveryStatus === "Sent"
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                    onClick={() => handleDelete(order.orderID)}
                    disabled={order.deliveryStatus === "Sent"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {showModal && selectedOrder && (
        <ViewDeliveryOrderModal
          order={selectedOrder}
          onClose={closeModal}
          onDelivered={fetchOrders} // ✅ Pass fetchOrders to refresh Delivery Table
        />
      )}
    </div>
  );
};

export default ShipList;
