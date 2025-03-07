import React from 'react';

const CheckoutModal = ({ cart, onClose, onCheckout }) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Checkout Summary</h2>
                <ul className="mb-4">
                    {cart.map((item) => (
                        <li key={item.id}>{item.name} x {item.quantity} = ₱{item.price * item.quantity}</li>
                    ))}
                </ul>
                <strong className="block mb-4">Total: ₱{total}</strong>
                <div className="flex justify-end gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => onCheckout(total)}>Confirm</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
