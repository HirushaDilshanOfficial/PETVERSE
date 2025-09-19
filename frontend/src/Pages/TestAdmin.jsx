import React from "react";
import AdminDashboard from "../Components/AdminDashboard";

const TestAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#1E40AF] mb-6">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Review and manage provider advertisements below.
        </p>

        <AdminDashboard />
      </div>
    </div>
  );
};

export default TestAdmin;
