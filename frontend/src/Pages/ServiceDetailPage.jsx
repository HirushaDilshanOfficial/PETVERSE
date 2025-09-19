import React from "react";
import FeedbackSection from "../Components/FeedbackSection";

const ServiceDetailPage = () => {
  const testId = "64f64aa40c7b34a1e9e50b0f";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#1E40AF] mb-2">
          Service Detail
        </h1>
        <p className="text-gray-600 mb-6">
          Explore details of this service and share your feedback below.
        </p>

        {/* Feedback Section */}
        <FeedbackSection serviceID={testId} />

        {/* Example buttons for actions */}
        <div className="mt-6 flex gap-4">
          <button className="px-5 py-2 rounded-lg bg-[#1E40AF] text-white font-medium hover:bg-[#F97316] transition">
            Book Service
          </button>
          <button className="px-5 py-2 rounded-lg bg-[#1E40AF] text-white font-medium hover:bg-[#F97316] transition">
            Contact Provider
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;


