// src/private/Purchasing/StockVerification.jsx

import { useState } from "react";

const StockVerification = () => {
  const [deliveries] = useState([
    { id: 1, product: "Paracetamol", ordered: 100, received: 100 },
    { id: 2, product: "Syringes", ordered: 50, received: 45 },
  ]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Stock Verification</h3>
      <table className="w-full border text-gray-900">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2">Product</th>
            <th className="p-2">Ordered</th>
            <th className="p-2">Received</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="border-b">
              <td className="p-2">{delivery.product}</td>
              <td className="p-2">{delivery.ordered}</td>
              <td className="p-2">{delivery.received}</td>
              <td className="p-2">{delivery.ordered === delivery.received ? "Match" : "Mismatch"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockVerification;
