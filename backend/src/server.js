import express from "express";
import cors from "cors";
import serviceRoutes from "./Routes/serviceRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import { connectDB } from "./Config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./Middleware/rateLimiter.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

// Initialize Firebase configuration
import "./Config/firebase.js";
import "./Config/cloudinary.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "50mb" })); // Parse JSON bodies with larger limit for file uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Parse URL-encoded bodies
app.use(rateLimiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySuperSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Request logging middleware (uncomment for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PETVERSE Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ------------------- OTP Email Flow -------------------

// In-memory OTP store
// Structure: { "userEmail": { otp: "123456", expires: Date, orderID } }
const otpStore = new Map();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your_email@gmail.com
    pass: process.env.EMAIL_PASS, // app password
  },
});

// Helper to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
app.post("/api/send-otp", async (req, res) => {
  const { email, orderID } = req.body;
  if (!email || !orderID) return res.status(400).json({ message: "Email and orderID are required" });

  const otp = generateOTP();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(email, { otp, expires, orderID });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Payment",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ message: "No OTP found for this email" });
  if (record.expires < Date.now()) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }
  if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  // OTP is valid → remove it
  otpStore.delete(email);

  // Optionally, fetch order from DB here using record.orderID

  res.json({ message: "OTP verified successfully", orderID: record.orderID });
});

// ------------------------------------------------------

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PETVERSE Backend server started on PORT: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Frontend URL: ${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }`
  );
});