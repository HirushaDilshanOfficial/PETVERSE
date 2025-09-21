import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../Controllers/serviceController.js";
import upload from "../Middleware/upload.js"; // ✅ use memory storage

// Create router
const router = express.Router();

// Simple CRUD routes
router.get("/", getAllServices); // GET all services
router.get("/:id", getServiceById); // GET one service by ID
router.post("/", upload.array("images", 3), createService); // CREATE new service with Cloudinary uploads
router.put("/:id", updateService); // UPDATE service by ID
router.delete("/:id", deleteService); // DELETE service by ID

export default router;
