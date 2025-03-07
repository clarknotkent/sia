import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import ProductLookup from './ProductLookup';
import CartTable from './CartTable';
import CheckoutModal from './CheckoutModal';
import ReceiptModal from './ReceiptModal';

const POSDashboard = () => {
    const [cart, setCart] = useState([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const handleCheckout = (totalAmount) => {
        const receipt = {
            cart,
            totalAmount,
            date: new Date().toLocaleString(),
        };
        setReceiptData(receipt);
        setIsReceiptOpen(true);
        setCart([]); // Clear cart after checkout
    };

    return (
        <div className="flex h-screen w-screen">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Point of Sale (POS)</h1>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <ProductLookup onAddToCart={handleAddToCart} />
                    <CartTable cart={cart} setCart={setCart} onProceed={() => setIsCheckoutOpen(true)} />
                </div>

                {isCheckoutOpen && <CheckoutModal cart={cart} onClose={() => setIsCheckoutOpen(false)} onCheckout={handleCheckout} />}
                {isReceiptOpen && <ReceiptModal receipt={receiptData} onClose={() => setIsReceiptOpen(false)} />}
            </div>
        </div>
    );
};

export default POSDashboard;
