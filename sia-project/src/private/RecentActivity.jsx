// src/private/RecentActivity.jsx
import React from "react";

const RecentActivity = () => {
  const mockActivity = [
    { type: "Order", detail: "New client order received", time: "2 mins ago" },
    { type: "Delivery", detail: "Delivery #1042 marked as delivered", time: "15 mins ago" },
    { type: "Stock-In", detail: "Paracetamol restocked (Batch #2025)", time: "30 mins ago" },
    { type: "PO", detail: "PO #0027 submitted to Supplier A", time: "1 hour ago" },
  ];

  return (
    <div className="bg-white p-6 rounded shadow-md border border-gray-300 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
      <ul className="space-y-3 text-sm">
        {mockActivity.map((item, idx) => (
          <li key={idx} className="border-b pb-2">
            <span className="font-medium text-blue-600">{item.type}</span>: {item.detail}
            <span className="block text-xs text-gray-400">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity; // ✅ This line is required
