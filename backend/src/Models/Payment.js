import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  // Custom payment ID (auto-generated)
  paymentID: { type: String, unique: true },

  // Reference to Order model (foreign key)
  orderID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order", 
    required: true 
  },

  // Reference to Advertisement (optional)
  ad_ID: { type: String, ref: "Advertisements" }, 

  transactionID: { type: String },
  amount: { type: Number, required: true },

  status: { 
    type: String, 
    enum: ["success", "failed", "pending"], 
    default: "pending" 
  },

  paidAt: { type: Date, default: Date.now }
});

// Auto-generate a custom paymentID before saving
paymentSchema.pre("save", function (next) {
  if (!this.paymentID) {
    // Example: PAY-20250918-<5-digit-random>
    this.paymentID = "PAY-" + 
                     new Date().toISOString().slice(0,10).replace(/-/g, "") + 
                     "-" + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);