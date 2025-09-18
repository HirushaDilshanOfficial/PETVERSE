// App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router";
import ProductPage from "./pages/ProductPage";
import ProductDetailedPage from "./pages/ProductDetailedPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./contexts/CartContext";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
//import MiniCart from "./Components/MiniCart";

function App() {
  return (
    <CartProvider>
        {/*
<header className="p-4 bg-[#1E40AF] text-white flex justify-between items-center">
  <Link to="/" className="font-bold">Home</Link>
  <MiniCart />
</header>
*/}


        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/products/:id" element={<ProductDetailedPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      
    </CartProvider>
  );
}

export default App;
