import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

/* ================= GET USER NOTIFICATIONS ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

/* ================= MARK NOTIFICATION AS READ ================= */
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

/* ================= MARK ALL AS READ ================= */
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
});

/* ================= GET UNREAD COUNT ================= */
router.get("/unread-count", authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.userId,
      read: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Failed to get unread count" });
  }
});

/* ================= DELETE NOTIFICATION ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

/* ================= HELPER FUNCTION: CREATE NOTIFICATION ================= */
export const createNotification = async (
  userId,
  type,
  title,
  message,
  appointmentId = null
) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      appointmentId,
    });

    await notification.save();
    console.log("✅ Notification created:", notification._id);
    return notification;
  } catch (error) {
    console.error("❌ Create notification error:", error);
    throw error;
  }
};

export default router;