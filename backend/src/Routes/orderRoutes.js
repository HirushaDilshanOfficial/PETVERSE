import express from "express";
import { createOrder, getUserOrders } from "../Controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder); // Checkout
router.get("/:userID", getUserOrders); // User’s orders

export default router;
