// RatingsController.js
import mongoose from "mongoose";
import Ratings from "../Models/RatingsModel.js";
import cloudinary from "../Config/cloudinary.js";

// Create/Add new feedback
export const createRating = async (req, res) => {
  try {
    // Debug logging
    console.log("=== CREATE RATING DEBUG INFO ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request user:", req.user);
    console.log("===============================");

    // ✅ Take the userID from auth, not from body
    const userID = req.user?.userId; // Changed from req.user?._id to req.user?.userId

    // Check if userID is available
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Still allow serviceID and productID from frontend
    let { rating, feedback, serviceID, productID } = req.body;
    let { image_url } = req.body;

    // Handle parsing of fields that might come as strings from FormData
    if (typeof rating === "string") {
      rating = parseInt(rating, 10);
    }

    // Convert string IDs to ObjectId if they exist
    if (serviceID && typeof serviceID === "string") {
      serviceID = new mongoose.Types.ObjectId(serviceID);
    }

    if (productID && typeof productID === "string") {
      productID = new mongoose.Types.ObjectId(productID);
    }

    // Debug logging
    console.log("Extracted data:", {
      rating,
      feedback,
      serviceID,
      productID,
      image_url,
    });
    console.log("Rating type:", typeof rating);

    // Validate required fields
    if (rating === undefined || rating === null || isNaN(rating)) {
      return res
        .status(400)
        .json({ message: "Rating is required and must be a number" });
    }

    if (!feedback || typeof feedback !== "string") {
      return res
        .status(400)
        .json({ message: "Feedback is required and must be a string" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (
      (!serviceID || serviceID === "null") &&
      (!productID || productID === "null")
    ) {
      return res
        .status(400)
        .json({ message: "Either serviceID or productID is required" });
    }

    // Handle image upload if present
    if (req.file?.path) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "petverse/ratings",
        resource_type: "image",
      });
      image_url = upload.secure_url;
    }

    const newFeedback = new Ratings({
      rating,
      feedback,
      userID, // 👈 from req.user
      serviceID,
      productID,
      image_url,
    });

    // Debug logging
    console.log("About to save feedback:", newFeedback);

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    console.error("Error in createRating:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    if (err.name === "ValidationError") {
      console.error("Validation errors:", err.errors);
    }
    res.status(400).json({ message: err.message });
  }
};

// Get feedbacks (with optional filters)
export const getRatings = async (req, res) => {
  try {
    const { productID, serviceID } = req.query;

    let filter = {};
    if (productID) {
      const trimmedProductID = productID.trim();
      filter.productID = mongoose.Types.ObjectId.isValid(trimmedProductID)
        ? new mongoose.Types.ObjectId(trimmedProductID)
        : trimmedProductID;
    }
    if (serviceID) {
      const trimmedServiceID = serviceID.trim();
      filter.serviceID = mongoose.Types.ObjectId.isValid(trimmedServiceID)
        ? new mongoose.Types.ObjectId(trimmedServiceID)
        : trimmedServiceID;
    }

    const feedbacks = await Ratings.find(filter)
      .populate("serviceID")
      .populate("productID");

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update feedback
export const updateRating = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    let { image_url } = req.body;

    if (req.file?.path) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "petverse/ratings",
        resource_type: "image",
      });
      image_url = upload.secure_url;
    }

    const update = {};
    if (rating !== undefined) update.rating = rating;
    if (feedback !== undefined) update.feedback = feedback;
    if (image_url !== undefined) update.image_url = image_url;

    // ⚠️ Optional: check if the logged-in user owns the feedback before updating
    const updatedFeedback = await Ratings.findOneAndUpdate(
      { _id: req.params.id, userID: req.user?._id }, // only update own feedback
      update,
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this feedback" });
    }

    res.json(updatedFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete feedback
export const deleteRating = async (req, res) => {
  try {
    // ⚠️ Optional: restrict deletion to the logged-in user
    const deleted = await Ratings.findOneAndDelete({
      _id: req.params.id,
      userID: req.user?._id,
    });

    if (!deleted) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this feedback" });
    }

    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
