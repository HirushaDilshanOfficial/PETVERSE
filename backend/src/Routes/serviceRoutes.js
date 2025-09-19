import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from "../Controllers/serviceController.js";
import upload from "../Middleware/upload.js"; // ✅ use memory storage

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", upload.array("images", 3), createService); // Cloudinary uploads
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
