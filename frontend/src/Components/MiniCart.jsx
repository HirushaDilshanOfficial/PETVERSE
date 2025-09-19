import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";

const MiniCart = () => {
  const { cart, subtotal } = useContext(CartContext);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link 
      to="/cart" 
      className="flex items-center space-x-2 bg-[#F97316] hover:bg-[#ea580c] px-3 py-2 rounded-lg transition-all duration-300 shadow-md"
    >
      <svg 
        className="w-6 h-6 text-white" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-white text-sm font-semibold">Cart</span>
        <span className="text-white text-xs">
          {totalItems} item{totalItems !== 1 ? 's' : ''} - Rs.{subtotal.toFixed(2)}
        </span>
      </div>
    </Link>
  );
};

export default MiniCart;