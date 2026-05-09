import { useEffect, useMemo, useRef, useState } from "react";
import { createSale, searchProductsForSale } from "../../services/sellService";
import "../../styles/sellPage.css";

export default function SellPage() {
  // Input States
  const [keyword, setKeyword] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Cart & Modal States
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Checkout States
  const [cutDebit, setCutDebit] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customer_id, setCustomer_id] = useState(0);
  const [paidAmount, setPaidAmount] = useState("");
  const [discount, setDiscount] = useState(0);

  // System States
  const [selling, setSelling] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Refs for Keyboard Focus Flow
  const searchInputRef = useRef(null);
  const quantityInputRef = useRef(null);
  const paidAmountRef = useRef(null);

  // Calculations
  const subtotal = useMemo(() => cartItems.reduce((t, i) => t + i.lineTotal, 0), [cartItems]);
  const grandTotal = useMemo(() => Math.max(subtotal - (Number(discount) || 0), 0), [subtotal, discount]);
  const balance = useMemo(() => (Number(paidAmount) || 0) - grandTotal, [paidAmount, grandTotal]);

  // --- Search Logic ---
  useEffect(() => {
    const delay = setTimeout(() => {
      if (keyword.trim()) {
        fetchProducts(keyword);
      } else {
        setFilteredProducts([]);
        setSelectedIndex(0);
      }
    }, 200);
    return () => clearTimeout(delay);
  }, [keyword]);

  const fetchProducts = async (q) => {
    try {
      const data = await searchProductsForSale(q);
      console.log("Search Results:", data);
      const items = Array.isArray(data) ? data : data.products || [];
      setFilteredProducts(items);
      setSelectedIndex(0); // Reset selection to top item
    } catch { 
      setError("Search failed"); 
    }
  };

  // --- Keyboard Flow Control ---

  // 1. Enter/Arrows on Search -> Move to Qty or navigate table
  const handleSearchKeyDown = (e) => {
    if (filteredProducts.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredProducts.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        // Select the highlighted product and move to quantity
        setSelectedProduct(filteredProducts[selectedIndex]);
        setFilteredProducts([]); // Hide the search table
        quantityInputRef.current?.focus();
        quantityInputRef.current?.select();
      }
    } else if (e.key === "F9" && cartItems.length > 0) {
      e.preventDefault();
      openPaymentModal();
    }
  };

  // 2. Enter on Qty -> Add to Cart & Move back to Search
  const handleQuantityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddProduct();
    }
  };

  // Global hotkeys (Modal support)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.code === "Space" && !showPaymentModal && cartItems.length > 0) {
        e.preventDefault();
        openPaymentModal();
      }
      if (e.key === "Escape" && showPaymentModal) {
        setShowPaymentModal(false);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [showPaymentModal, cartItems]);

  // --- Actions ---
  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0) return;

    if (quantity > selectedProduct.stockQty) {
      setError(`Only ${selectedProduct.stockQty} items available in stock.`);
      return;
    }

    const price = Number(selectedProduct.sellingPrice || selectedProduct.price || 0);
    const existing = cartItems.find(i => i.product_id === selectedProduct.product_id);
    
    if (existing) {
      setCartItems(cartItems.map(i => i.product_id === selectedProduct.product_id 
        ? { ...i, quantity: i.quantity + Number(quantity), lineTotal: (i.quantity + Number(quantity)) * price } 
        : i));
    } else {
      setCartItems([...cartItems, {
        product_id: selectedProduct.product_id,
        name: selectedProduct.name,
        sellingPrice: selectedProduct.sellingPrice,
        quantity: Number(quantity),
        lineTotal: selectedProduct.sellingPrice * Number(quantity)
      }]);
    }

    // Reset Flow
    setKeyword("");
    setQuantity(0);
    setSelectedProduct(null);
    setFilteredProducts([]);
    searchInputRef.current?.focus();
  };

  const removeCartItem = (id) => {
    setCartItems(cartItems.filter(item => item.product_id !== id));
    searchInputRef.current?.focus();
  };

  const openPaymentModal = () => {
    setShowPaymentModal(true);
    setTimeout(() => paidAmountRef.current?.focus(), 100);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setPaidAmount("");
    setDiscount(0);
    setPaymentMethod("cash");
    setCutDebit(false);
    setCustomer_id(0);
    setShowPaymentModal(false);
    setError("");
    setSuccessMessage("");
    searchInputRef.current?.focus();
  };

  const handleSell = async () => {
    if (cartItems.length === 0 || balance < 0) return;
    if (cutDebit && customer_id === "0") {
      setError("Please select a customer for debit transactions.");
      return;
    }
    if (cutDebit && paymentMethod === "card") {
      setError("Cut Debit option is not allowed with Card payments.");
      return;
    } // should be updated
    if(balance < 0 && !customer_id) {
      setError("Please select a customer for credit transactions.");
      return;
    }
    console.log("Initiating Sale with:", { items: cartItems, discount, paymentMethod,grandTotal_from_client: grandTotal, cut_debit: cutDebit, customer_id, paidAmount, createdBy: "Admin" });
    setSelling(true);
    try {
      await createSale({ items: cartItems, discount, paymentMethod, cut_debit: cutDebit, grandTotal_from_client: grandTotal, customer_id, paidAmount, createdBy: "Admin" });
      setSuccessMessage("Sale completed successfully!");
      handleClearCart();
    } catch (err) { 
      setError("Sale Failed. Please try again."); 
    } finally { 
      setSelling(false); 
    }
  };

  return (
    <div className="pos-workspace">
      
      {/* TOP COMMAND BAR */}
      <div className="command-bar-card">
        <div className="search-group relative-container">
          <label>Search Product</label>
          <input
            ref={searchInputRef}
            type="text"
            className={`modern-input ${selectedProduct ? "input-selected-mode" : ""}`}
            //placeholder={selectedProduct ? `Selected: ${selectedProduct.name} - Press Enter on Qty` : "Type name or scan barcode..."}
            value={selectedProduct ? selectedProduct.name : keyword}
            onChange={(e) => {
              if (selectedProduct) setSelectedProduct(null); 
              setKeyword(e.target.value);
            }}
            onKeyDown={handleSearchKeyDown}
            autoFocus
          />
          
          {/* SEARCH RESULTS TABLE (Absolute Positioned) */}
          {filteredProducts.length > 0 && !selectedProduct && (
            <div className="search-results-overlay">
              <table className="search-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, i) => (
                    <tr 
                      key={p.product_id} 
                      className={i === selectedIndex ? "active-row" : ""}
                      onClick={() => {
                        setSelectedProduct(p);
                        setFilteredProducts([]);
                        quantityInputRef.current?.focus();
                        quantityInputRef.current?.select();
                      }}
                    >
                      <td className="font-bold">{p.name}</td>
                      <td className="text-right text-primary font-bold">
                        Rs. {p.sellingPrice || p.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="qty-group">
          <label>Qty</label>
          <input 
            ref={quantityInputRef}
            type="number" 
            className="modern-input text-center"
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={handleQuantityKeyDown}
            min="1"
          />
        </div>

        <button 
          className="add-btn" 
          onClick={handleAddProduct}
          disabled={!selectedProduct}
        >
          ADD ↵
        </button>
      </div>

      {/* MIDDLE CART TABLE */}
      <div className="cart-table-card">
        <div className="table-wrapper">
          <table className="main-cart-table">
            <thead>
              <tr>
                <th className="w-50">Product Name</th>
                <th className="text-center w-15">Qty</th>
                <th className="text-right w-15">Unit Price</th>
                <th className="text-right w-15">Total</th>
                <th className="text-center w-5"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">Cart is empty. Search to add products.</td>
                </tr>
              ) : (
                cartItems.map((item, index) => (
                  <tr key={item.product_id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td className="font-bold">{item.name}</td>
                    <td className="text-center font-bold">{item.quantity}</td>
                    <td className="text-right">Rs. {item.sellingPrice.toFixed(2)}</td>
                    <td className="text-right font-bold text-primary">Rs. {item.lineTotal.toFixed(2)}</td>
                    <td className="text-center">
                      <button className="del-btn" onClick={() => removeCartItem(item.product_id)}>✕</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM SUMMARY BAR */}
      <div className="summary-bar-card">
        <div className="summary-info">
          <h2>Items: {cartItems.reduce((acc, item) => acc + item.quantity, 0)}</h2>
          <h1>Total: Rs. {subtotal.toFixed(2)}</h1>
        </div>
        <button 
          className="proceed-btn" 
          disabled={cartItems.length === 0} 
          onClick={openPaymentModal}
        >
          PROCEED PAYMENT [F9]
        </button>
      </div>

      {/* PAYMENT MODAL (Untouched from your requirement) */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="bill-card">
            <div className="bill-card-header">
              <h4>Bill Summary</h4>
              <span>Current Sale</span>
            </div>

            <div className="bill-row">
              <span>Subtotal</span>
              <strong>Rs. {subtotal.toFixed(2)}</strong>
            </div>

            <div className="bill-input-group">
              <label>Discount</label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>

            <div className="grand-total-box">
              <span>Grand Total</span>
              <strong>Rs. {grandTotal.toFixed(2)}</strong>
            </div>

            <div className="bill-input-group">
              <label>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div className="bill-input-group">
              <label>Customer </label>
              <select
                value={customer_id}
                onChange={(e) => setCustomerid(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>

            <div className="bill-input-group">
              <label>Paid Amount</label>
              <input
                ref={paidAmountRef}
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Enter customer paid amount"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !selling && balance >= 0) {
                    e.preventDefault();
                    handleSell();
                  }
                }}
              />
            </div>

            <div className="balance-box">
              <span>Balance</span>
              <strong className={balance < 0 ? "balance-danger" : "balance-success"}>
                Rs. {balance.toFixed(2)}
              </strong>
            </div>
            
            <div className="bill-input-group" style={{ marginTop: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={cutDebit}
                  onChange={(e) => setCutDebit(e.target.checked)}
                />
                Cut Debit (Allow Credit Adjustment)
              </label>
            </div>

            <button
              type="button"
              className="sell-complete-btn"
              disabled={selling || cartItems.length === 0 || balance < 0}
              onClick={handleSell}
            >
              {selling ? "Processing Sale..." : "SELL NOW (Enter)"}
            </button>

            <button
              type="button"
              className="new-sale-btn"
              onClick={handleClearCart}
            >
              Cancel / New Sale (Esc)
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {(error || successMessage) && (
        <div className={`toast-message ${error ? 'error' : 'success'}`}>
          {error || successMessage}
        </div>
      )}
    </div>
  );
}