import Advertisement from "../Models/AdvertisementModel.js";
import cloudinary from "../Config/cloudinary.js";
import multer from "multer";

// Use multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Create a new advertisement with image upload
export const createAdvertisement = async (req, res) => {
  try {
    let imageUrl = "";

    // If file exists, upload to Cloudinary
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ads" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer); // Pipe buffer to Cloudinary
      });
    }

    // Convert duration to number
    const duration = Number(req.body.duration);

    const ad = new Advertisement({
      provider_ID: req.body.provider_ID,
      title: req.body.title,
      description: req.body.description,
      imageUrl,
      duration: req.body.duration,
      created_at: new Date(),
      approved_at: null,
      status: "pending",
    });

    const savedAd = await ad.save();
    res.status(201).json({ ad: savedAd });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Get all ads
export const getAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pending ads
export const getPendingAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ status: "pending" });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approved ads
export const getApprovedAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ status: "approved" });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve ad
export const approveAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject ad
export const rejectAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ads by provider
export const getProviderAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ provider_ID: req.query.provider_ID });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
