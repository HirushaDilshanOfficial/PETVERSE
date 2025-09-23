import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signin, signout, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signin(formData.email, formData.password);
      console.log("Signin response:", response);
      console.log("User from context:", user);

      // Check if user is admin after login
      // The response contains {user: userData} structure
      if (response && response.user && response.user.role === "admin") {
        console.log("Navigating to admin dashboard");
        // Use a small delay to ensure state is updated
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 100);
      } else {
        // If not admin, show error and logout
        alert("Access denied. Admin credentials required.");
        await signout();
        // Redirect to home page after logout with fromLogout state
        navigate("/", { state: { fromLogout: true } });
      }
    } catch (err) {
      console.error("Admin login failed:", err);
    }
  };

  // Check user role on component mount and when user changes
  useEffect(() => {
    if (user && user.role === "admin") {
      // If user is already logged in as admin, redirect to dashboard
      navigate("/admin/dashboard");
    } else if (user && user.role !== "admin") {
      // If user is logged in but not as admin, redirect to home page for pet owners
      // or to their dashboard for service providers
      const roleRedirects = {
        admin: "/admin/dashboard",
        serviceProvider: "/dashboard/service-provider",
        petOwner: "/", // Redirect pet owners to home page
      };

      const redirectPath = roleRedirects[user.role] || "/dashboard";
      navigate(redirectPath);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-crown text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            PETVERSE Admin
          </h2>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {/* Admin Warning */}
        <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-shield-alt text-purple-400"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">
                Administrator Access Only
              </h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>
                  This area is restricted to authorized PETVERSE administrators
                  only. Unauthorized access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-red-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your admin email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your admin password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-shield-alt mr-2"></i>
                    Sign In as Admin
                  </>
                )}
              </button>
            </div>

            {/* Back to Main Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to User Login
              </Link>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
            <i className="fas fa-lock text-purple-500 mr-2"></i>
            Security Notice
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <p>All admin activities are logged and monitored</p>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <p>Multi-factor authentication is recommended</p>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <p>Session timeout after 30 minutes of inactivity</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              For security issues, contact IT support at{" "}
              <a
                href="mailto:security@petverse.com"
                className="text-purple-600 hover:text-purple-500"
              >
                security@petverse.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 PETVERSE. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
