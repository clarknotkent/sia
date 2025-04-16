import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import CartPanel from "./CartPanel";
import ProductGrid from "./ProductGrid";
import Pagination from "../../components/Pagination";
import ReceiptModal from "./ReceiptModal";

const POSDashboard = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const pageSize = 15;

  // ✅ Fetch products from backend inventory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/inventory");
        const productList = res.data.map((item) => ({
          id: item.id,
          genericName: item.genericName,
          brandName: item.brandName,
          unitOfMeasurement: item.unitOfMeasurement,
          price: item.price || 0,
          image: item.image || "/default-product.svg",
        }));
        setAllProducts(productList);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter(
    (product) =>
      (product.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.unitOfMeasurement.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter ? product.unitOfMeasurement === categoryFilter : true)
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleProductSelect = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, discount: 0 }]);
    }
  };

  const handleProceed = async () => {
    if (cartItems.length === 0) return alert("Cart is empty.");

    try {
      const payload = {
        cartItems,
        paymentMethod: "Cash",
      };

      const response = await axios.post("/api/pos/checkout", payload);

      setReceiptData({
        items: cartItems,
        orderNumber: response.data.transaction.orderId,
        orderDate: new Date().toLocaleString(),
        paymentMethod: payload.paymentMethod,
      });

      setCartItems([]);
      setShowReceiptModal(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.response?.data?.error || "Failed to process checkout.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Point of Sale (Walk-in Customers)
        </h1>

        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          <div className="flex-1 bg-white p-4 rounded shadow border overflow-hidden flex flex-col">
            <div className="flex justify-between items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by name or category"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border p-2 rounded w-full bg-white text-black"
              />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border p-2 rounded bg-white text-black"
              >
                <option value="">All Categories</option>
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Capsule">Capsule</option>
                <option value="Supplement">Supplement</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Cream">Cream</option>
              </select>
            </div>

            <div className="flex-1 overflow-auto max-h-[660px]">
              <ProductGrid products={paginatedProducts} onSelect={handleProductSelect} />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          <div className="w-[350px] h-full overflow-y-auto">
            <CartPanel
              cartItems={cartItems}
              onUpdateItem={(index, field, value) => {
                const updatedCart = [...cartItems];
                updatedCart[index][field] = value;
                setCartItems(updatedCart);
              }}
              onRemoveItem={(index) => {
                const updatedCart = [...cartItems];
                updatedCart.splice(index, 1);
                setCartItems(updatedCart);
              }}
              onHold={() => alert("Hold Order removed for now.")}
              onProceed={handleProceed}
              onClear={() => setCartItems([])}
            />
          </div>
        </div>
      </div>

      {showReceiptModal && receiptData && (
        <ReceiptModal
          cartItems={receiptData.items}
          orderNumber={receiptData.orderNumber}
          orderDate={receiptData.orderDate}
          paymentMethod={receiptData.paymentMethod}
          onClose={() => setShowReceiptModal(false)}
          onClear={() => setCartItems([])}
        />
      )}
    </div>
  );
};

export default POSDashboard;
