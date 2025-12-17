import Appointment from "../models/Appointment.js";
import Pet from "../models/Pet.js";
import { createNotification } from "../routes/notificationRoutes.js";

/* ================= CREATE APPOINTMENT ================= */
export const createAppointment = async (req, res) => {
  try {
    const {
      petId,
      services,
      appointmentDate,
      appointmentTime,
      totalAmount,
      paymentMethod
    } = req.body;

    // Validation
    if (!petId || !services || !appointmentDate || !appointmentTime || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify pet belongs to user
    const pet = await Pet.findOne({ _id: petId, userId: req.userId });
    if (!pet) {
      return res.status(404).json({ message: "Pet not found or doesn't belong to you" });
    }

    // Create appointment
    const appointment = new Appointment({
      userId: req.userId,
      petId,
      services,
      appointmentDate,
      appointmentTime,
      totalAmount,
      paymentMethod,
      status: "PENDING"
    });

    await appointment.save();
    await appointment.populate('petId', 'name breed profileImage');

    // ✅ Send notification
    await createNotification(
      req.userId,
      "APPOINTMENT",
      "Appointment Created! 📅",
      `Your appointment for ${pet.name} on ${appointmentDate} at ${appointmentTime} has been submitted and is pending approval.`,
      appointment._id
    );

    console.log("✅ Appointment created:", appointment);
    res.status(201).json(appointment);

  } catch (error) {
    console.error("❌ Create appointment error:", error);
    res.status(500).json({ message: "Failed to create appointment", error: error.message });
  }
};

/* ================= GET USER'S APPOINTMENTS ================= */
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate('petId', 'name breed profileImage size')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${appointments.length} appointments for user ${req.userId}`);
    res.status(200).json(appointments);

  } catch (error) {
    console.error("❌ Get appointments error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* ================= GET SINGLE APPOINTMENT ================= */
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('petId', 'name breed profileImage size age gender');

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);

  } catch (error) {
    console.error("❌ Get appointment error:", error);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};

/* ================= UPDATE APPOINTMENT (User can only cancel) ================= */
export const updateAppointment = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Users can only cancel their appointments
    if (status && status !== "CANCELLED") {
      return res.status(403).json({ message: "You can only cancel appointments" });
    }

    if (status === "CANCELLED") {
      appointment.status = "CANCELLED";
      appointment.cancellationReason = cancellationReason || "Cancelled by user";

      // ✅ Send notification
      await createNotification(
        req.userId,
        "STATUS_UPDATE",
        "Appointment Cancelled",
        `Your appointment on ${appointment.appointmentDate} has been cancelled.`,
        appointment._id
      );
    }

    await appointment.save();
    await appointment.populate('petId', 'name breed profileImage');

    console.log("✅ Appointment updated:", appointment);
    res.status(200).json(appointment);

  } catch (error) {
    console.error("❌ Update appointment error:", error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

/* ================= DELETE APPOINTMENT ================= */
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    console.log("✅ Appointment deleted:", req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });

  } catch (error) {
    console.error("❌ Delete appointment error:", error);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
};

/* ================= GET ALL APPOINTMENTS (ADMIN ONLY) ================= */
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'username email')
      .populate('petId', 'name breed profileImage size')
      .sort({ createdAt: -1 });

    console.log(`✅ Admin fetched ${appointments.length} appointments`);
    res.status(200).json(appointments);

  } catch (error) {
    console.error("❌ Get all appointments error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* ================= UPDATE APPOINTMENT STATUS (ADMIN ONLY) ================= */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('petId', 'name breed profileImage');

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const oldStatus = appointment.status;
    appointment.status = status;
    if (adminNotes) {
      appointment.adminNotes = adminNotes;
    }

    await appointment.save();

    // ✅ Send notification based on status change
    let notificationTitle = "";
    let notificationMessage = "";

    switch (status) {
      case "APPROVED":
        notificationTitle = "Appointment Approved! ✅";
        notificationMessage = `Great news! Your appointment for ${appointment.petId.name} on ${appointment.appointmentDate} has been approved.`;
        break;
      case "IN_PROGRESS":
        notificationTitle = "Grooming in Progress 🛁";
        notificationMessage = `Your pet ${appointment.petId.name} is currently being groomed. We'll notify you when it's done!`;
        break;
      case "COMPLETED":
        notificationTitle = "Grooming Complete! 🎉";
        notificationMessage = `${appointment.petId.name} is all done and looking fabulous! You can pick them up now.`;
        break;
      case "CLAIMED":
        notificationTitle = "Pet Picked Up 🐾";
        notificationMessage = `Thank you for choosing HappyPaws! We hope ${appointment.petId.name} enjoyed their grooming session.`;
        break;
      case "CANCELLED":
        notificationTitle = "Appointment Cancelled";
        notificationMessage = `Your appointment for ${appointment.petId.name} on ${appointment.appointmentDate} has been cancelled.`;
        break;
    }

    if (notificationTitle && oldStatus !== status) {
      await createNotification(
        appointment.userId._id,
        "STATUS_UPDATE",
        notificationTitle,
        notificationMessage,
        appointment._id
      );
    }

    console.log("✅ Admin updated appointment status:", appointment);
    res.status(200).json(appointment);

  } catch (error) {
    console.error("❌ Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};