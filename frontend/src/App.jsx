// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage.jsx";
import ProductDetailedPage from "./pages/ProductDetailedPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { CartProvider } from "./contexts/CartContext";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
// Import Home component
import Home from "./pages/Home.jsx";
// Import auth components
import Login from "./pages/auth/Login.js";
import RoleSelection from "./pages/auth/RoleSelection.js";
import PetOwnerSignup from "./pages/auth/PetOwnerSignup.js";
import ServiceProviderSignup from "./pages/auth/ServiceProviderSignup.js";
import ForgotPassword from "./pages/auth/ForgotPassword.js";
// Import test component
import TestPage from "./pages/TestPage.jsx";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailedPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/signup/petOwner" element={<PetOwnerSignup />} />
        <Route path="/signup/serviceProvider" element={<ServiceProviderSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </CartProvider>
  );
}

export default App;