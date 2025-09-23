import express from "express";
import Payment from "../Models/Payment.js";
import mongoose from "mongoose";
import {
  createPayment,
  updatePaymentStatus,
  getPayment,
} from "../Controllers/paymentController.js";

const router = express.Router();

// Regular payment creation
router.post("/", createPayment);

// Update payment status
router.put("/:paymentID", updatePaymentStatus);

// Get payment details
router.get("/:paymentID", getPayment);

// Demo payment route (saves to DB)
router.post("/demo/pay", async (req, res) => {
  const { amount, paymentType, referenceId, orderID, cardDetails } = req.body;

  const success = Math.random() > 0.2; // simulate success/failure
  const status = success ? "success" : "failed";

  try {
    console.log("=== Payment Debug Info ===");
    console.log("orderID:", orderID);
    console.log("amount:", amount);
    console.log("paymentType:", paymentType);
    console.log("referenceId:", referenceId);
    console.log("status:", status);

    // Validate required fields
    if (!orderID || !amount) {
      console.log("Missing required fields");
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: orderID and amount are required",
      });
    }

    // Validate orderID format
    if (!mongoose.Types.ObjectId.isValid(orderID)) {
      console.log("Invalid orderID format");
      return res.status(400).json({
        status: "error",
        message: "Invalid orderID format",
      });
    }

    // Convert orderID to ObjectId
    const orderObjectId = new mongoose.Types.ObjectId(orderID);

    // Save demo payment to database
    const newPayment = new Payment({
      orderID: orderObjectId, // link to the order
      transactionID: referenceId || "DEMO-" + Date.now(),
      amount,
      status,
    });

    console.log("Saving payment:", newPayment);

    await newPayment.save();

    console.log("Payment saved successfully:", newPayment._id);

    return res.json({
      status,
      message: `Payment ${status} for ${paymentType}`,
      payment: {
        paymentID: newPayment.paymentID,
        transactionID: newPayment.transactionID,
        amount: newPayment.amount,
        status: newPayment.status,
        paidAt: newPayment.paidAt,
        orderID: newPayment.orderID,
      },
    });
  } catch (error) {
    console.error("Error saving demo payment:", error);
    return res.status(500).json({
      status: "error",
      message: "DB error",
      error: error.message,
    });
  }
});

export default router;
