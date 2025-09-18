import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../Controllers/cartController.js";

const router = express.Router();

// Get cart
router.get("/", getCart);

// Add item
router.post("/add", addToCart);

// Update item quantity (matches frontend PUT /api/cart/:productId)
router.put("/:productId", updateCartItem);

// Remove item (matches frontend DELETE /api/cart/:productId)
router.delete("/:productId", removeCartItem);

// Clear cart
router.delete("/clear", clearCart);

export default router;
