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
// Import additional components
import ServiceDetailPage from "./Pages/ServiceDetailPage";
import ServicesPage from "./pages/ServicesPage.jsx";
import Contactus from "./Pages/Contactus";
import TestProvider from "./Pages/TestProvider";
import TestAdmin from "./Pages/TestAdmin";
import TestHome from "./Pages/TestHome";
// Import dashboard components
import PetOwnerProfile from "./pages/dashboards/PetOwnerProfile.jsx";
import ServiceProviderDashboard from "./pages/dashboards/ServiceProviderDashboard.js";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
// Import Admin sub-pages
import UserManagementPage from "./pages/admin/UserManagementPage.jsx";
import KYCReviewPage from "./pages/admin/KYCReviewPage.jsx";
import InventoryPage from "./pages/admin/InventoryPage.jsx";
import AnalysisPage from "./pages/admin/AnalysisPage.jsx";
import ProfilePage from "./pages/admin/ProfilePage.jsx";
// Import DashboardRedirect component
import DashboardRedirect from "./components/common/DashboardRedirect.jsx";
// Import Protected Routes
import ProtectedRoute, {
  AdminRoute,
  ServiceProviderRoute,
  PetOwnerRoute,
} from "./components/common/ProtectedRoute";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailedPage />} />
        <Route
          path="/cart"
          element={
            <PetOwnerRoute>
              <CartPage />
            </PetOwnerRoute>
          }
        />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/signup/petOwner" element={<PetOwnerSignup />} />
        <Route
          path="/signup/serviceProvider"
          element={<ServiceProviderSignup />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/pet-owner/profile"
          element={
            <PetOwnerRoute>
              <PetOwnerProfile />
            </PetOwnerRoute>
          }
        />
        <Route
          path="/dashboard/service-provider"
          element={
            <ServiceProviderRoute>
              <ServiceProviderDashboard />
            </ServiceProviderRoute>
          }
        />
        {/* Admin Routes with Layout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="kyc" element={<KYCReviewPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="analytics" element={<AnalysisPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        {/* Additional Routes */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/ServiceDetailPage" element={<ServiceDetailPage />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/TestAdmin" element={<TestAdmin />} />
        <Route path="/TestHome" element={<TestHome />} />
        <Route path="/TestProvider" element={<TestProvider />} />
        {/* Redirect dashboard to appropriate role-based dashboard */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
