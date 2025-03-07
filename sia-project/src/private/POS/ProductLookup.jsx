import React from 'react';

const ProductLookup = ({ onAddToCart }) => {
    const placeholderProducts = [
        { id: 1, name: 'Paracetamol', price: 5 },
        { id: 2, name: 'Cough Syrup', price: 50 },
        { id: 3, name: 'Amoxicillin', price: 10 },
    ];

    return (
        <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Product Lookup</h2>
            <input className="border p-2 rounded w-full mb-2 bg-white text-gray-800" placeholder="Search product by name or barcode..." />
            <table className="w-full border-collapse border border-gray-300 text-sm text-gray-800 bg-white">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2">Product</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {placeholderProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-100">
                            <td className="border p-2">{product.name}</td>
                            <td className="border p-2">₱{product.price}</td>
                            <td className="border p-2 text-center">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => onAddToCart(product)}>
                                    Add to Cart
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductLookup;
