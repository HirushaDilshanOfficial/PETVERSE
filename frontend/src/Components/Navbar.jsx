import React from "react";
import { Link } from "react-router";

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
        {[
          { name: "Home", path: "/" },
          { name: "Services", path: "/" },  // You can keep it same as ServicePage
          { name: "Create", path: "/create" },
          { name: "Dashboard", path: "/provider/dashboard" },
        ].map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="px-4 py-2 rounded-full hover:bg-[#F97316] transition-all duration-300"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth Buttons */}
      <div className="flex space-x-4">
        <Link
          to="/signin"
          className="px-4 py-2 rounded-full bg-white text-[#1E40AF] font-semibold hover:bg-gray-200 transition-all duration-300"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#ea580c] transition-all duration-300"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
