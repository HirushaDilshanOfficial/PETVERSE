import express from "express";
import { createPayment, updatePaymentStatus, getPayment } from "../Controllers/paymentController.js";

const router = express.Router();

router.post("/", createPayment);
router.put("/:paymentID", updatePaymentStatus);
router.get("/:paymentID", getPayment);

export default router;
