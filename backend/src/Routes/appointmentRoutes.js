import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../Controllers/appointmentController.js";

const router = express.Router();

// Create a new appointment
router.post("/", createAppointment);

// Get all appointments
router.get("/", getAppointments);

// Get single appointment by ID
router.get("/:id", getAppointmentById);

// Update appointment by ID
router.put("/:id", updateAppointment);

// Delete appointment by ID
router.delete("/:id", deleteAppointment);

export default router;
