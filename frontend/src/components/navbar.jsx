import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#1E40AF] text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/PVL4.png"
          alt="PetVet Logo"
          className="h-12 w-12 mr-3"
        />
        <span className="font-bold text-xl">PETVERSE</span>
      </div>

      {/* Links */}
      <ul className="flex space-x-6 font-semibold">
        {["Home", "Services", "Products", "About"].map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="px-4 py-2 rounded-full hover:bg-[#F97316] transition-all duration-300"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* Auth Buttons */}
      <div className="flex space-x-4">
        <a
          href="#signin"
          className="px-4 py-2 rounded-full bg-white text-[#1E40AF] font-semibold hover:bg-gray-200 transition-all duration-300"
        >
          Log In
        </a>
        <a
          href="#signup"
          className="px-4 py-2 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#ea580c] transition-all duration-300"
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
