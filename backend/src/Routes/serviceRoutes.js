import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../Controllers/serviceController.js";

// Create router
const router = express.Router();

// Simple CRUD routes
router.get("/", getAllServices); // GET all services
router.get("/:id", getServiceById); // GET one service by ID
router.post("/", createService); // CREATE new service
router.put("/:id", updateService); // UPDATE service by ID
router.delete("/:id", deleteService); // DELETE service by ID

export default router;
