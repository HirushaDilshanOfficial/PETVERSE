import express from "express";
import {
  createAdvertisement,
  getAdvertisements,
  getPendingAdvertisements,
  approveAdvertisement,
  rejectAdvertisement,
  getApprovedAdvertisements,
  getProviderAdvertisements,
  upload,
} from "../Controllers/AdvertisementController.js";

const router = express.Router();

// Upload an ad (multipart/form-data)
router.post("/", upload.single("image"), createAdvertisement);

// Other routes
router.get("/", getAdvertisements);
router.get("/pending", getPendingAdvertisements);
router.get("/approved", getApprovedAdvertisements);
router.get("/by-provider", getProviderAdvertisements);
router.put("/:id/approve", approveAdvertisement);
router.put("/:id/reject", rejectAdvertisement);

export default router;

