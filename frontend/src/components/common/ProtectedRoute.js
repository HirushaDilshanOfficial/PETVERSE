import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole, redirectTo = "/login" }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If a specific role is required, check user's role
  if (requiredRole && userProfile?.role !== requiredRole) {
    // Redirect based on user's actual role
    const roleRedirects = {
      admin: "/dashboard/admin",
      serviceProvider: "/dashboard/service-provider",
      petOwner: "/dashboard/pet-owner",
    };

    const userRole = userProfile?.role;
    const redirectPath = roleRedirects[userRole] || "/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  // Allow access if all checks pass
  return children;
};

// Higher-order component for role-based access
export const withRoleAccess = (WrappedComponent, requiredRole) => {
  return function RoleProtectedComponent(props) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};

// Specific protected route components for each role
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const ServiceProviderRoute = ({ children }) => (
  <ProtectedRoute requiredRole="serviceProvider">{children}</ProtectedRoute>
);

export const PetOwnerRoute = ({ children }) => (
  <ProtectedRoute requiredRole="petOwner">{children}</ProtectedRoute>
);

// Route that requires any authenticated user (no specific role)
export const AuthenticatedRoute = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export default ProtectedRoute;
