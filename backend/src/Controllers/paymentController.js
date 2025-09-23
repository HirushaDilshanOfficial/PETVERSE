import Payment from "../Models/Payment.js";

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { orderID, transactionID, amount } = req.body;

    const newPayment = new Payment({
      orderID,
      transactionID,
      amount,
      status: "pending" // default
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment",
      error: error.message,
    });
  }
};

// Update payment status (success/failed/pending)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentID } = req.params;
    const { status } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { paymentID },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, message: "Payment updated", payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get payment details
export const getPayment = async (req, res) => {
  try {
    const { paymentID } = req.params;
    const payment = await Payment.findOne({ paymentID }).populate("orderID");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};