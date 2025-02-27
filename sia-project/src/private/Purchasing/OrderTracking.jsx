// src/private/Purchasing/OrderTracking.jsx

import { useState } from "react";

const OrderTracking = () => {
  const [orders] = useState([
    { id: 1, product: "Paracetamol", status: "Processing" },
    { id: 2, product: "Syringes", status: "Shipped" },
  ]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Order Tracking</h3>
      <table className="w-full border text-gray-900">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2">Product</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-2">{order.product}</td>
              <td className="p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTracking;
