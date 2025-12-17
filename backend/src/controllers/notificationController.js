import Notification from "../models/Notification.js";

/* ================= CREATE NOTIFICATION ================= */
export const createNotification = async (userId, type, title, message, relatedId = null) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      relatedId,
    });

    await notification.save();
    console.log("✅ Notification created:", notification._id);
    return notification;
  } catch (error) {
    console.error("❌ Create notification error:", error);
    throw error;
  }
};

/* ================= GET USER NOTIFICATIONS ================= */
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50); // Limit to 50 notifications

    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ================= MARK NOTIFICATION AS READ ================= */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("❌ Mark as read error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

/* ================= MARK ALL AS READ ================= */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("❌ Mark all as read error:", error);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

/* ================= DELETE NOTIFICATION ================= */
export const deleteNotification = async (req, res) => {
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
    console.error("❌ Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

/* ================= GET UNREAD COUNT ================= */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.userId,
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("❌ Get unread count error:", error);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};