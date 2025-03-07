import React from 'react';

const CartTable = ({ cart, setCart, onProceed }) => {
    const updateQuantity = (id, quantity) => {
        setCart(cart.map((item) => item.id === id ? { ...item, quantity: Number(quantity) } : item));
    };

    const removeItem = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Cart</h2>
            <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800 bg-white">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2">Product</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Quantity</th>
                        <th className="border p-2">Subtotal</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-100">
                            <td className="border p-2">{item.name}</td>
                            <td className="border p-2">₱{item.price}</td>
                            <td className="border p-2">
                                <input type="number" value={item.quantity} min="1" className="border p-1 w-16" onChange={(e) => updateQuantity(item.id, e.target.value)} />
                            </td>
                            <td className="border p-2">₱{item.price * item.quantity}</td>
                            <td className="border p-2">
                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => removeItem(item.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <strong>Total: ₱{total}</strong>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={onProceed}>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default CartTable;
