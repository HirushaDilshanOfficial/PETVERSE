import React from "react";
import AdFrontend from "../Components/AdFrontend";

const TestProvider = () => {
  const providerId = "12345"; // Replace with real provider ID

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#1E40AF] mb-2">
          Provider Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your advertisements below. Add new ads, view your active ads, and monitor their status.
        </p>

        {/* Advertisement Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <AdFrontend providerId={providerId} />
        </div>

        {/* Example action buttons (optional) */}
        <div className="mt-6 flex gap-4">
          <button className="px-5 py-2 rounded-lg bg-[#1E40AF] text-white font-medium hover:bg-[#F97316] transition">
            Create New Ad
          </button>
          <button className="px-5 py-2 rounded-lg bg-[#1E40AF] text-white font-medium hover:bg-[#F97316] transition">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestProvider;
