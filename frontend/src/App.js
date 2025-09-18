import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute, {
  AdminRoute,
  ServiceProviderRoute,
  PetOwnerRoute,
} from "./components/common/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import RoleSelection from "./pages/auth/RoleSelection";
import PetOwnerSignup from "./pages/auth/PetOwnerSignup";
import ServiceProviderSignup from "./pages/auth/ServiceProviderSignup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLogin from "./pages/auth/AdminLogin";

// Dashboard Pages
import ServiceProviderDashboard from "./pages/dashboards/ServiceProviderDashboard";
import PetOwnerProfile from "./pages/dashboards/PetOwnerProfile";

// Admin Components
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagementPage from "./pages/admin/UserManagementPage";
import KYCReviewPage from "./pages/admin/KYCReviewPage";
import InventoryPage from "./pages/admin/InventoryPage";
import AnalysisPage from "./pages/admin/AnalysisPage";
import ProfilePage from "./pages/admin/ProfilePage";
import AdminDashboardRedirect from "./components/admin/AdminDashboardRedirect";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<RoleSelection />} />
            <Route path="/signup/petOwner" element={<PetOwnerSignup />} />
            <Route
              path="/signup/serviceProvider"
              element={<ServiceProviderSignup />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />

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

            {/* Legacy admin route redirect */}
            <Route
              path="/dashboard/admin"
              element={
                <AdminRoute>
                  <AdminDashboardRedirect />
                </AdminRoute>
              }
            />

            {/* Generic Dashboard Route - Redirects based on role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* Catch All Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

// Component to redirect users to their appropriate dashboard based on role
const DashboardRedirect = () => {
  const { userProfile, loading } = useAuth();

  // Show loading while userProfile is being fetched
  if (loading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const roleRedirects = {
    admin: "/admin/dashboard",
    serviceProvider: "/dashboard/service-provider",
    petOwner: "/dashboard/pet-owner/profile",
  };

  const redirectPath = roleRedirects[userProfile?.role] || "/login";

  return <Navigate to={redirectPath} replace />;
};

export default App;
