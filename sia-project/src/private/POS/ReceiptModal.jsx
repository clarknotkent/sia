import React, { useRef, useState, useEffect } from "react";

const ReceiptModal = ({ cartItems, onClose, onClear }) => {
  const printRef = useRef();
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity * (1 - item.discount / 100),
    0
  );
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  // Auto-generate order number and date
  useEffect(() => {
    const randomOrderNumber = Math.floor(1000 + Math.random() * 9000);
    setOrderNumber(`ORD-${randomOrderNumber}`);
    setOrderDate(new Date().toLocaleString());
  }, []);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2, h4 { text-align: center; margin: 0; }
            .meta { margin-top: 10px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; }
            th { background-color: #f0f0f0; text-align: left; }
            tfoot td { font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    onClear(); // ✅ Clear cart after printing
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative text-black">

        <div ref={printRef}>
          <h2 className="text-xl font-bold text-center mb-1">Order Receipt</h2>
          <h4 className="text-center text-sm mb-4">Thank you for your purchase!</h4>

          {/* Meta Info */}
          <div className="meta text-sm mb-2">
            <p><strong>Order No:</strong> {orderNumber}</p>
            <p><strong>Date:</strong> {orderDate}</p>
            <p><strong>Payment Method:</strong> {paymentMethod}</p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Discount</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.discount}%</td>
                  <td>₱{(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Subtotal</td>
                <td>₱{subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3">Tax (12%)</td>
                <td>₱{tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3">Total</td>
                <td>₱{total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Method Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Select Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black"
          >
            <option value="Cash">Cash</option>
            <option value="E-wallet">E-wallet</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
