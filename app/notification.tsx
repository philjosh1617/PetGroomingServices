import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.100.19:3000/api/notifications";

interface Notification {
  _id: string;
  type: "WELCOME" | "APPOINTMENT" | "STATUS_UPDATE" | "REMINDER" | "PROMOTION";
  title: string;
  message: string;
  appointmentId?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // Show sample notifications if not logged in
        setNotifications(getSampleNotifications());
        setLoading(false);
        return;
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(response.data);
      const unread = response.data.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Fallback to sample notifications
      setNotifications(getSampleNotifications());
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `${API_URL}/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `${API_URL}/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "WELCOME":
        return "hand-left";
      case "APPOINTMENT":
        return "calendar";
      case "STATUS_UPDATE":
        return "checkmark-circle";
      case "REMINDER":
        return "time";
      case "PROMOTION":
        return "pricetag";
      default:
        return "notifications";
    }
  };

  // Get color based on notification type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "WELCOME":
        return "#4CAF50";
      case "APPOINTMENT":
        return "#2196F3";
      case "STATUS_UPDATE":
        return "#FF9800";
      case "REMINDER":
        return "#FFA726";
      case "PROMOTION":
        return "#E91E63";
      default:
        return "#9E9E9E";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Sample notifications for demo
  const getSampleNotifications = (): Notification[] => [
    {
      _id: "1",
      type: "WELCOME",
      title: "Welcome to HappyPaws! 🐾",
      message:
        "We're so glad to have you! Let's make today pawsome for you and your furry friend!",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      type: "PROMOTION",
      title: "Special Offer 🎉",
      message:
        "Enjoy 20% off on your pet's first grooming session — treat your pup to a fresh new look today!",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: "3",
      type: "APPOINTMENT",
      title: "Appointment Confirmed ✅",
      message:
        "Your grooming appointment has been successfully confirmed! We look forward to pampering your pet soon.",
      read: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: "4",
      type: "REMINDER",
      title: "Appointment Tomorrow 📅",
      message:
        "Reminder: Your pet's grooming appointment is scheduled for tomorrow at 10:00 AM. See you soon!",
      read: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#143470" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>NOTIFICATIONS</Text>

        <TouchableOpacity style={styles.iconButton} onPress={markAllAsRead}>
          <Ionicons name="checkmark-done" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Unread count badge */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Notification list */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              We'll notify you when something important happens
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification._id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
              onPress={() => markAsRead(notification._id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${getNotificationColor(notification.type)}20`,
                  },
                ]}
              >
                <Ionicons
                  name={getNotificationIcon(notification.type) as any}
                  size={24}
                  color={getNotificationColor(notification.type)}
                />
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationText}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationDate}>
                  {formatDate(notification.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDEFD0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDEFD0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#143470",
  },
  iconButton: {
    padding: 8,
  },
  pageTitle: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  unreadBanner: {
    backgroundColor: "#FF8C00",
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    borderLeftWidth: 4,
    borderLeftColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftColor: "#FF8C00",
    backgroundColor: "#FFFEF8",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF8C00",
    marginLeft: 8,
  },
  notificationText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: "#999",
  },
  
});