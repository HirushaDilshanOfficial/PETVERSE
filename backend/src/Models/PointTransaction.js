// models/PointTransaction.js
import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, ref: "User", unique: true },
    loyalty_points: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// ✅ Use default export (simpler)
const Points = mongoose.model("Points", pointsSchema);
export default Points;

