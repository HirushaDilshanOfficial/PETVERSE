import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router";

const MiniCart = () => {
  const { cart, subtotal } = useContext(CartContext);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link to="/cart" className="bg-[#F97316] px-4 py-2 rounded-lg hover:opacity-90 transition">
      Cart ({totalItems}) - Rs.{subtotal}
    </Link>
  );
};

export default MiniCart;
