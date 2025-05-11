// src/private/POS/ReceiptModal.jsx
import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ReceiptModal = ({
  cartItems,
  onCancel,
  onConfirm,
  isViewOnly = false,
  orderMeta = {},
}) => {
  const printRef = useRef();
  const [paymentMethod, setPaymentMethod] = useState(orderMeta.paymentMethod || "Cash");
  const [orderNumber, setOrderNumber] = useState(orderMeta.orderId || "");
  const [orderDate, setOrderDate] = useState(
    orderMeta.date ? new Date(orderMeta.date).toLocaleString() : ""
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity * (1 - item.discount / 100),
    0
  );
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  useEffect(() => {
    if (!orderNumber) setOrderNumber(`ORD-${Date.now()}`);
    if (!orderDate) setOrderDate(new Date().toLocaleString());
  }, [orderNumber, orderDate]);

  const handlePrint = () => {
    const html = printRef.current.innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head>
        <title>Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding:20px; }
          table { width:100%; border-collapse:collapse; margin-top:20px; }
          th,td { border:1px solid #000; padding:8px; text-align:left; }
          th { background:#f0f0f0; }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();

    if (!isViewOnly && onConfirm) onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-black">
        <div ref={printRef}>
          <h1 className="text-2xl font-bold text-center">Health Key Pharma</h1>
          <h2 className="text-xl text-center mb-4">Order Receipt</h2>
          <p><strong>Order No:</strong> {orderNumber}</p>
          <p><strong>Date:</strong> {orderDate}</p>
          <p><strong>Payment:</strong> {paymentMethod}</p>

          <table>
            <thead>
              <tr>
                <th>Item</th><th>Brand</th><th>Unit</th>
                <th>Qty</th><th>Disc</th><th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((it, i) => (
                <tr key={i}>
                  <td>{it.genericName}</td>
                  <td>{it.brandName || "-"}</td>
                  <td>{it.unitOfMeasurement}</td>
                  <td>{it.quantity}</td>
                  <td>{it.discount}%</td>
                  <td>₱{(it.price * it.quantity * (1 - it.discount / 100)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan="5">Subtotal</td><td>₱{subtotal.toFixed(2)}</td></tr>
              <tr><td colSpan="5">Tax (12%)</td><td>₱{tax.toFixed(2)}</td></tr>
              <tr><td colSpan="5">Total</td><td>₱{total.toFixed(2)}</td></tr>
            </tfoot>
          </table>
        </div>

        {!isViewOnly && (
          <div className="mt-4">
            <label className="block mb-1">Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option>Cash</option>
              <option>E-wallet</option>
              <option>Bank Transfer</option>
            </select>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            {isViewOnly ? "Close" : "Cancel"}
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {isViewOnly ? "Print" : "Print & Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

ReceiptModal.propTypes = {
  cartItems: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  isViewOnly: PropTypes.bool,
  orderMeta: PropTypes.shape({
    orderId: PropTypes.string,
    date: PropTypes.string,
    paymentMethod: PropTypes.string,
  }),
};

export default ReceiptModal;
