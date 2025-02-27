// src/private/Purchasing/PurchaseRequest.jsx

import { useState } from "react";

const PurchaseRequest = () => {
  const [formData, setFormData] = useState({ supplier: "", product: "", quantity: "", notes: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Purchase request submitted!");
    setFormData({ supplier: "", product: "", quantity: "", notes: "" });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Create Purchase Request</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Supplier" className="input-field" required />
        <input type="text" placeholder="Product" className="input-field" required />
        <input type="number" placeholder="Quantity" className="input-field" required />
        <input type="text" placeholder="Notes (optional)" className="input-field" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Request</button>
      </form>
    </div>
  );
};

export default PurchaseRequest;
