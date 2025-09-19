// RatingsController.js
import mongoose from "mongoose";
import Ratings from "../Models/RatingsModel.js";
import cloudinary from "../Config/cloudinary.js";

// Create/Add new feedback
export const createRating = async (req, res) => {
  try {
    // ✅ Take the userID from auth, not from body
    const userID = req.user?._id;

    // Still allow serviceID and productID from frontend
    const { rating, feedback, serviceID, productID } = req.body;
    let { image_url } = req.body;

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
      userID,        // 👈 from req.user
      serviceID,
      productID,
      image_url,
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
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
      { _id: req.params.id, userID: req.user?._id },  // only update own feedback
      update,
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(403).json({ message: "Not authorized to update this feedback" });
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
      return res.status(403).json({ message: "Not authorized to delete this feedback" });
    }

    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
