import express from "express";
import {
  createPayment,
  updatePaymentStatus,
  getPayment,
} from "../Controllers/paymentController.js";

const router = express.Router();

router.post("/", createPayment);


router.put("/:paymentID", updatePaymentStatus);


router.get("/:paymentID", getPayment);


router.post("/demo/pay", (req, res) => {
  const { amount, paymentType, referenceId } = req.body;

  const success = Math.random() > 0.2; 

  if (success) {
    return res.json({
      status: "success",
      message: `Payment successful for ${paymentType}`,
      amount,
      referenceId,
    });
  } else {
    return res.json({
      status: "failed",
      message: `Payment failed for ${paymentType}`,
      amount,
      referenceId,
    });
  }
});

export default router;