import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";

const router = express.Router();

/* ================= ADMIN ROUTES (must be first to avoid conflicts) ================= */

// Get all appointments (admin)
router.get("/admin/all", adminAuthMiddleware, getAllAppointments);

// Update appointment status (admin)
router.put("/admin/:id/status", adminAuthMiddleware, updateAppointmentStatus);

/* ================= USER ROUTES ================= */

// Create new appointment
router.post("/", authMiddleware, createAppointment);

// Get user's appointments
router.get("/", authMiddleware, getUserAppointments);

// Get single appointment
router.get("/:id", authMiddleware, getAppointmentById);

// Update appointment (user can cancel)
router.put("/:id", authMiddleware, updateAppointment);

// Delete appointment
router.delete("/:id", authMiddleware, deleteAppointment);

/* ================= ADMIN ROUTES (We'll add admin middleware later) ================= */

// Get all appointments (admin)
router.get("/admin/all", authMiddleware, getAllAppointments);

// Update appointment status (admin)
router.put("/admin/:id/status", authMiddleware, updateAppointmentStatus);

export default router;