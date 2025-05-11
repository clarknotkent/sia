// src/private/POS/POSDashboard.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import CartPanel from "./CartPanel";
import ProductGrid from "./ProductGrid";
import Pagination from "../../components/Pagination";
import ReceiptModal from "./ReceiptModal";
import TransactionHistory from "./TransactionHistory";

const POSDashboard = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState({ items: [], meta: {}, isViewOnly: false });
  const [activeTab, setActiveTab] = useState("pos");
  const checkoutBackup = useRef({ products: [], cart: [] });
  const pageSize = 15;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("/api/inventory");
        const productList = res.data.map((item) => ({
          id: item.id,
          genericName: item.genericName,
          brandName: item.brandName,
          unitOfMeasurement: item.unitOfMeasurement,
          price: item.price || 0,
          stockLevel: item.inventory?.stockLevel || 0,
          image: item.image || "/default-product.svg",
        }));
        setAllProducts(productList);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter((p) =>
    (p.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.unitOfMeasurement.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter ? p.unitOfMeasurement === categoryFilter : true)
  );
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleProductSelect = (product) => {
    if (product.stockLevel === 0) return alert("No stock available for this product.");
    setAllProducts((prev) => prev.map((p) =>
      p.id === product.id ? { ...p, stockLevel: p.stockLevel - 1 } : p
    ));
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1, discount: 0 }];
    });
  };

  const handleRemoveFromCart = (index) => {
    const item = cartItems[index];
    setAllProducts((prev) => prev.map((p) =>
      p.id === item.id ? { ...p, stockLevel: p.stockLevel + item.quantity } : p
    ));
    setCartItems((prev) => {
      const cp = [...prev];
      cp.splice(index, 1);
      return cp;
    });
  };

  const handleClearCart = () => {
    setAllProducts((prev) =>
      prev.map((p) => {
        const inCart = cartItems.find((ci) => ci.id === p.id);
        return inCart ? { ...p, stockLevel: p.stockLevel + inCart.quantity } : p;
      })
    );
    setCartItems([]);
  };

  const handleUpdateCartItem = (index, field, value) => {
    const oldItem = cartItems[index];
    if (field === "quantity") {
      const newQty = value;
      const delta = newQty - oldItem.quantity;
      if (delta > 0) {
        const prod = allProducts.find((p) => p.id === oldItem.id);
        if (!prod || prod.stockLevel < delta) {
          return alert(`Insufficient stock for ${oldItem.genericName}`);
        }
      }
      setAllProducts((prev) =>
        prev.map((p) =>
          p.id === oldItem.id ? { ...p, stockLevel: p.stockLevel - delta } : p
        )
      );
      setCartItems((prev) => {
        const cp = [...prev];
        cp[index] = { ...cp[index], quantity: newQty };
        return cp;
      });
    } else if (field === "discount") {
      setCartItems((prev) => {
        const cp = [...prev];
        cp[index] = { ...cp[index], discount: value };
        return cp;
      });
    }
  };

  const handleProceed = () => {
    if (cartItems.length === 0) return alert("Cart is empty.");
    checkoutBackup.current = {
      products: allProducts.map((p) => ({ ...p })),
      cart: cartItems.map((i) => ({ ...i })),
    };
    setReceiptData({ items: cartItems, meta: {}, isViewOnly: false });
    setShowReceiptModal(true);
  };

  const handleConfirmCheckout = async () => {
    try {
      await axios.post("/api/pos/checkout", {
        cartItems,
        paymentMethod: "Cash",
      });
      setCartItems([]);
      checkoutBackup.current = { products: [], cart: [] };
      setShowReceiptModal(false);
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(err.response?.data?.error || "Checkout failed.");
    }
  };

  // ✅ FIXED version of the handler for TransactionHistory view/reprint
  const handleViewReceipt = (tx, isPrintMode) => {
    const mappedItems = tx.items.map(item => ({
      genericName: item.name || "-",
      brandName: item.brandName || "-",
      unitOfMeasurement: item.unit || "unit",
      quantity: item.quantity || 0,
      discount: item.discount || 0,
      price: item.unitPrice || 0,
    }));

    setReceiptData({
      items: mappedItems,
      meta: {
        orderId: tx.orderId,
        date: tx.date,
        paymentMethod: tx.paymentMethod,
      },
      isViewOnly: !isPrintMode,
    });
    setShowReceiptModal(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Point of Sale</h1>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "pos" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("pos")}
          >
            POS
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "history" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveTab("history")}
          >
            Transaction History
          </button>
        </div>

        {activeTab === "pos" && (
          <div className="flex gap-6 h-[calc(100vh-8rem)]">
            <div className="flex-1 bg-white p-4 rounded shadow border flex flex-col">
              <div className="flex justify-between mb-4 gap-2">
                <input
                  type="text"
                  placeholder="Search…"
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
                <ProductGrid
                  products={paginatedProducts}
                  onSelect={handleProductSelect}
                />
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
                onUpdateItem={handleUpdateCartItem}
                onRemoveItem={handleRemoveFromCart}
                onProceed={handleProceed}
                onClear={handleClearCart}
              />
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white p-6 rounded shadow border h-[calc(100vh-8rem)] overflow-auto">
            <TransactionHistory onViewReceipt={handleViewReceipt} />
          </div>
        )}

        {showReceiptModal && (
          <ReceiptModal
            cartItems={receiptData.items}
            isViewOnly={receiptData.isViewOnly}
            orderMeta={receiptData.meta}
            onCancel={() => {
              setShowReceiptModal(false);
              if (!receiptData.isViewOnly) {
                setAllProducts(checkoutBackup.current.products);
                setCartItems(checkoutBackup.current.cart);
              }
            }}
            onConfirm={handleConfirmCheckout}
          />
        )}
      </div>
    </div>
  );
};

export default POSDashboard;
