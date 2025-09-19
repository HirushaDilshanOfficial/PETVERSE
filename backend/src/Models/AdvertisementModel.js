// backend/src/Models/AdvertisementModel.js
import mongoose from "mongoose";

const AdvertisementSchema = new mongoose.Schema({
  provider_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider", // assumes you have a Provider model
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // store the URL or filename if uploading
  },
  duration: {
    type: Number, // e.g., number of days
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  approved_at: {
    type: Date,
  },
});

const Advertisement = mongoose.model("Advertisement", AdvertisementSchema);
export default Advertisement;
