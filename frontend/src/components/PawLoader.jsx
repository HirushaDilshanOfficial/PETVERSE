// src/components/PawLoader.jsx
import React from "react";
import { FaPaw } from "react-icons/fa";

const PawLoader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <FaPaw className="text-[#F97316] w-16 h-16 animate-bounce" />
    </div>
  );
};

export default PawLoader;
