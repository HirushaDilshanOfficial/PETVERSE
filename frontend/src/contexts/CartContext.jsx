import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [adding, setAdding] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Fetch cart from backend once
  const getCart = async () => {
    setLoadingCart(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/cart`, {
        withCredentials: true,
      });
      const data = res.data;
      setCart(data.cart || []);
      setSubtotal(data.subtotal || 0);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to fetch cart");
    } finally {
      setLoadingCart(false);
    }
  };

  // Add item to cart
  const addToCart = async (productID, quantity = 1) => {
    if (adding) return; // prevent multiple clicks
    setAdding(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/cart/add`,
        { productID, quantity },
        { withCredentials: true }
      );
      const data = res.data;
      setCart(data.cart || []);
      setSubtotal(data.subtotal || 0);
      setTotal(data.total || 0);
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  // Update item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      const data = res.data;
      setCart(data.cart || []);
      setSubtotal(data.subtotal || 0);
      setTotal(data.total || 0);
      toast.success("Cart updated!");
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error("Failed to update cart");
    }
  };

  // Remove item from cart
  const removeCartItem = async (productId) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/cart/${productId}`,
        { withCredentials: true }
      );
      const data = res.data;
      setCart(data.cart || []);
      setSubtotal(data.subtotal || 0);
      setTotal(data.total || 0);
      toast.success("Item removed from cart!");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/cart/clear`,
        { withCredentials: true }
      );
      const data = res.data;
      setCart(data.cart || []);
      setSubtotal(data.subtotal || 0);
      setTotal(data.total || 0);
      toast.success("Cart cleared!");
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart");
    }
  };

  // Load cart on app start
  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        total,
        loadingCart,
        adding,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
