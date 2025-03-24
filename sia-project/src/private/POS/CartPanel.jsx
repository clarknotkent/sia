// src/private/POS/CartPanel.jsx
import React from 'react';

const CartPanel = ({ cartItems, onUpdateItem, onRemoveItem, onHold, onProceed, onClear }) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity * (1 - item.discount / 100),
    0
  );
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  return (
    <div className="w-full bg-white p-4 rounded shadow-lg text-black">
      <h2 className="text-lg font-bold mb-4">Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">No items in cart.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="border p-2 rounded relative">
              <button
                className="absolute top-1 right-2 text-gray-500 hover:text-red-600 text-xl font-semibold bg-transparent"
                onClick={() => onRemoveItem(index)}
              >
                ×
              </button>

              <div className="font-semibold">{item.name}</div>
              <div className="flex items-center space-x-2 mt-2">
                <label className="text-sm">Qty</label>
                <input
                  type="number"
                  className="border rounded w-16 p-1 text-center bg-white text-black"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value))}
                />
                <label className="text-sm ml-2">Discount %</label>
                <input
                  type="number"
                  className="border rounded w-16 p-1 text-center bg-white text-black"
                  value={item.discount}
                  min={0}
                  onChange={(e) => onUpdateItem(index, 'discount', parseFloat(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 border-t pt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₱ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (12%):</span>
          <span>₱ {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>₱ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full"
          onClick={onClear}
        >
          Clear Cart
        </button>
        <div className="flex gap-2">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
            onClick={onHold}
          >
            Hold Order
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            onClick={onProceed}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
