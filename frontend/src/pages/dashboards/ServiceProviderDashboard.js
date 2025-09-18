import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const ServiceProviderDashboard = () => {
  const { userProfile, getDisplayName, signout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "fas fa-home" },
    { id: "appointments", name: "Appointments", icon: "fas fa-calendar-alt" },
    { id: "services", name: "My Services", icon: "fas fa-briefcase" },
    { id: "clients", name: "Clients", icon: "fas fa-users" },
    { id: "earnings", name: "Earnings", icon: "fas fa-chart-line" },
    { id: "profile", name: "Profile", icon: "fas fa-user" },
  ];

  // Check verification status
  const isVerified = userProfile?.isVerified || false;
  const verificationStatus = userProfile?.verificationStatus || "pending";

  const renderVerificationBanner = () => {
    if (isVerified) return null;

    return (
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-triangle text-yellow-400"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Account Verification{" "}
              {verificationStatus === "pending" ? "Pending" : "Required"}
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              {verificationStatus === "pending" ? (
                <p>
                  Your account is currently under review by our admin team. This
                  usually takes 24-48 hours. You'll receive an email
                  notification once your account is verified.
                </p>
              ) : (
                <p>
                  Please complete your profile and upload required documents to
                  start offering services.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {renderVerificationBanner()}

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {getDisplayName()}! 👨‍⚕️
              </h2>
              <p className="text-orange-100">
                {isVerified
                  ? "Manage your services and connect with pet owners in your area."
                  : "Your account verification is in progress. Get ready to start helping pet owners!"}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-calendar-check text-2xl text-orange-500"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Today's Appointments
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {isVerified ? "5" : "0"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-users text-2xl text-green-500"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Clients
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {isVerified ? "23" : "0"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-star text-2xl text-blue-500"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Average Rating
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {isVerified ? "4.8" : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-dollar-sign text-2xl text-purple-500"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      This Month's Earnings
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {isVerified ? "$1,250" : "$0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Business Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Business Name
                    </p>
                    <p className="text-lg text-gray-900">
                      {userProfile?.businessName || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Business Type
                    </p>
                    <p className="text-lg text-gray-900">
                      {userProfile?.businessType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      License Number
                    </p>
                    <p className="text-lg text-gray-900">
                      {userProfile?.licenseNumber || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Years of Experience
                    </p>
                    <p className="text-lg text-gray-900">
                      {userProfile?.yearsOfExperience || "Not specified"} years
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                {isVerified ? (
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <i className="fas fa-calendar-check text-green-500"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          New appointment booked
                        </p>
                        <p className="text-sm text-gray-500">
                          Sarah M. booked grooming service for tomorrow at 10:00
                          AM
                        </p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        1 hour ago
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <i className="fas fa-star text-blue-500"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          New 5-star review received
                        </p>
                        <p className="text-sm text-gray-500">
                          "Excellent service! My dog loves coming here."
                        </p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        3 hours ago
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <i className="fas fa-dollar-sign text-orange-500"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Payment received
                        </p>
                        <p className="text-sm text-gray-500">
                          $75.00 for vaccination service completed yesterday
                        </p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        1 day ago
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-clock text-4xl text-gray-400 mb-4"></i>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Waiting for Verification
                    </h4>
                    <p className="text-gray-600">
                      Once your account is verified, you'll see your activity
                      here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    className={`w-full flex items-center p-3 text-left border border-gray-200 rounded-lg transition-colors ${
                      isVerified
                        ? "hover:bg-gray-50"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!isVerified}
                  >
                    <i className="fas fa-plus-circle text-orange-500 mr-3"></i>
                    <span>Add New Service</span>
                  </button>
                  <button
                    className={`w-full flex items-center p-3 text-left border border-gray-200 rounded-lg transition-colors ${
                      isVerified
                        ? "hover:bg-gray-50"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!isVerified}
                  >
                    <i className="fas fa-calendar-plus text-green-500 mr-3"></i>
                    <span>Set Availability</span>
                  </button>
                  <button className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <i className="fas fa-user-edit text-blue-500 mr-3"></i>
                    <span>Update Profile</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Today's Schedule
                </h3>
                {isVerified ? (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-cut text-white"></i>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Dog Grooming
                        </p>
                        <p className="text-sm text-gray-500">
                          10:00 AM - Sarah M.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-user-md text-white"></i>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Health Checkup
                        </p>
                        <p className="text-sm text-gray-500">
                          2:00 PM - Mike R.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-calendar-times text-2xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">No appointments yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h2>

            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Verification Status
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isVerified ? "bg-green-100" : "bg-yellow-100"
                    }`}
                  >
                    <i
                      className={`fas ${
                        isVerified
                          ? "fa-check-circle text-green-500"
                          : "fa-clock text-yellow-500"
                      }`}
                    ></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">
                      {isVerified ? "Verified Account" : "Verification Pending"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isVerified
                        ? "Your account has been verified by our admin team."
                        : "Your account is currently under review by our admin team."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={userProfile?.fullName || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={userProfile?.email || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={userProfile?.phoneNumber || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={userProfile?.emergencyContact || ""}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      value={userProfile?.address || ""}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Business Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={userProfile?.businessName || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={userProfile?.businessType || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={userProfile?.licenseNumber || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={userProfile?.yearsOfExperience || ""}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services Offered
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      value={userProfile?.services || ""}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <i className="fas fa-construction text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600">This feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🐾</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">PETVERSE</h1>
                <p className="text-sm text-gray-500">
                  Service Provider Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {getDisplayName()}
                </p>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 capitalize mr-2">
                    {userProfile?.role}
                  </p>
                  {isVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <i className="fas fa-check-circle mr-1"></i>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <i className="fas fa-clock mr-1"></i>
                      Pending
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
