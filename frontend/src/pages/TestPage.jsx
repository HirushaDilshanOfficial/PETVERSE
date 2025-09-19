import React from "react";

const TestPage = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Test Page</h1>
        <p className="text-lg text-gray-700 mb-6">
          If you can see this page, routing is working correctly!
        </p>
        <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
          <span className="text-white text-2xl">✓</span>
        </div>
      </div>
    </div>
  );
};

export default TestPage;