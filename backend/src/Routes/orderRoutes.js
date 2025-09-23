// Routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  verifyOtp,
  resendOtp,
  updateOrder, // Add this import
} from "../Controllers/orderController.js";
import { requireAuth } from "../Middleware/auth.js";

const router = express.Router();

// Create order (checkout)
router.post("/", requireAuth, createOrder);

// Get order by ID
router.get("/:id", requireAuth, getOrderById);

// Update order
router.put("/:id", requireAuth, updateOrder); // Add this route

// Verify OTP after payment
router.post("/verify-otp", requireAuth, verifyOtp);

// Get logged-in user's orders
router.get("/", requireAuth, getUserOrders);

router.post("/resend-otp", requireAuth, resendOtp);

export default router;
