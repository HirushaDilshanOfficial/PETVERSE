import Order from "../Models/Order.js";
import Product from "../Models/Product.js";
import Cart from "../Models/Cart.js";
import crypto from "crypto";
import { sendOtpEmail } from "../Utils/emailService.js";
import mongoose from "mongoose";

// In-memory OTP store (demo). Use Redis or DB in production.
const otpStore = {};

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { billingAddress, shippingAddress, pointsRedeemed, paymentMethod } =
      req.body;

    // Get cart from database instead of session
    const userId = req.user.userId;

    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const cartDoc = await Cart.findOne({ userId: userObjectId });

    if (!cartDoc || cartDoc.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cart = cartDoc.items;

    const orderItems = cart.map((item) => ({
      productID: item.productId, // Changed from item.productID to item.productId
      name: item.name,
      pQuantity: item.quantity, // Changed from item.pQuantity to item.quantity
      pPrice: item.price, // Changed from item.pPrice to item.price
    }));

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.pPrice * item.pQuantity,
      0
    );

    const newOrder = new Order({
      userID: userObjectId,
      billingAddress,
      shippingAddress,
      items: orderItems,
      totalAmount,
      pointsRedeemed: pointsRedeemed || 0,
      paymentMethod,
    });

    await newOrder.save();

    // Clear cart from database
    cartDoc.items = [];
    cartDoc.subtotal = 0;
    await cartDoc.save();

    // If online payment, send OTP
    if (paymentMethod === "online") {
      const otp = crypto.randomInt(100000, 999999).toString();

      otpStore[newOrder._id] = {
        otp,
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      };

      await sendOtpEmail(req.user.email, otp);
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      userEmail: req.user.email,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== GET ORDER BY ID DEBUG INFO ===");
    console.log("Requested order ID:", id);
    console.log("Request user:", req.user);
    console.log("User ID from request:", req.user?.userId);
    console.log("User email from request:", req.user?.email);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid order ID format");
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);

    console.log("Order found in DB:", order);

    if (!order) {
      console.log("Order not found in database");
      // Let's also check if there are any orders in the database
      const allOrders = await Order.find({});
      console.log("All orders in database:", allOrders);
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the current user (for security)
    // Convert both IDs to strings for comparison
    const orderUserId = order.userID.toString();
    const reqUserId = req.user.userId.toString();

    console.log("Order user ID:", orderUserId);
    console.log("Request user ID:", reqUserId);
    console.log("Do IDs match?", orderUserId === reqUserId);

    if (orderUserId !== reqUserId) {
      console.log("User ID mismatch - access denied");
      return res.status(403).json({ message: "Access denied" });
    }

    console.log("Order found and accessible, sending response");
    res.json({ order });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ error: err.message });
  }
};

//VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { orderID, otp } = req.body;
    const stored = otpStore[orderID];

    if (!stored)
      return res.status(400).json({ message: "OTP not found or expired" });

    if (Date.now() > stored.expires) {
      delete otpStore[orderID];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    //  OTP is correct: update paymentStatus in DB
    const order = await Order.findById(orderID);
    if (!order) {
      delete otpStore[orderID];
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "Paid"; // or "Verified" depending on your schema
    await order.save();

    // Cleanup OTP from memory
    delete otpStore[orderID];

    res.json({ message: "Payment verified successfully", order });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

// RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { orderID } = req.body;

    if (!orderID)
      return res.status(400).json({ message: "Order ID is required" });

    const order = await Order.findById(orderID);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save in memory (for demo; use DB or Redis in production)
    otpStore[order._id] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    // Send OTP email
    await sendOtpEmail(req.user.email, otp);

    res.json({ message: "New OTP sent successfully" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error while resending OTP" });
  }
};

//  GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userID: req.user.userId });

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedItems = await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findOne({
              productID: item.productID,
            });
            return {
              ...item.toObject(),
              productDetails: product
                ? {
                    pName: product.pName,
                    pCategory: product.pCategory,
                    pImage: product.pImage,
                  }
                : null,
            };
          })
        );
        return { ...order.toObject(), items: detailedItems };
      })
    );

    res.json(detailedOrders);
  } catch (err) {
    console.error("Get user orders error:", err);
    res.status(500).json({ error: err.message });
  }
};
