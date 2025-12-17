import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = 'http://192.168.100.19:3000/api/appointments';

type Appointment = {
  _id: string;
  services: { serviceName: string; price: number }[];
  appointmentDate: string;
  appointmentTime: string;
  status: "PENDING" | "APPROVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "CLAIMED";
  totalAmount: number;
  petId: {
    name: string;
    profileImage: string;
  };
};

export default function AppointmentScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      setLoading(true);

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      console.log('✅ Appointments fetched:', response.data);
      setAppointments(response.data);
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const renderStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "CLAIMED":
        return { backgroundColor: "#4CAF50" }; // Green
      case "APPROVED":
        return { backgroundColor: "#2196F3" }; // Blue
      case "IN_PROGRESS":
        return { backgroundColor: "#FF9800" }; // Orange
      case "PENDING":
        return { backgroundColor: "#FFA500" }; // Yellow-Orange
      case "CANCELLED":
        return { backgroundColor: "#F44336" }; // Red
      default:
        return { backgroundColor: "gray" };
    }
  };

  const getServicesList = (services: { serviceName: string }[]) => {
    return services.map(s => s.serviceName).join(" | ");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/homebg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>APPOINTMENTS</Text>
          <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push("/notification")}>
            <Ionicons name="notifications" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#143470" />
            <Text style={styles.loadingText}>Loading appointments...</Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                {/* Section Header */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Appointment Details</Text>
                </View>
                
                {/* Pet Name */}
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Pet:</Text>
                  <Text style={styles.serviceText}>{item.petId?.name || "Unknown"}</Text>
                </View>

                {/* Service and Date */}
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Service:</Text>
                  <Text style={styles.serviceText}>{getServicesList(item.services)}</Text>
                </View>
                
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>Date:</Text>
                  <Text style={styles.dateText}>{item.appointmentDate} • {item.appointmentTime}</Text>
                </View>

                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>Total:</Text>
                  <Text style={styles.dateText}>₱{item.totalAmount}</Text>
                </View>

                {/* Separator Line */}
                <View style={styles.separator} />

                {/* Status Section */}
                <View style={styles.statusSection}>
                  <View style={[styles.statusBadge, renderStatusColor(item.status)]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={60} color="#ccc" />
                <Text style={styles.empty}>No appointments yet.</Text>
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => router.push("/(tabs)/booking")}
                >
                  <Text style={styles.bookButtonText}>Book Your First Appointment</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#143470",
  },
  pageTitle: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },
  notificationIcon: { padding: 8 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  serviceRow: { flexDirection: "row", marginBottom: 6 },
  serviceLabel: { fontSize: 14, fontWeight: "600", color: "#333", width: 70 },
  serviceText: { fontSize: 14, color: "#333", flex: 1 },
  dateRow: { flexDirection: "row", marginBottom: 6 },
  dateLabel: { fontSize: 14, fontWeight: "600", color: "#333", width: 70 },
  dateText: { fontSize: 14, color: "#333", flex: 1 },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 8 },
  statusSection: { marginTop: 8 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  empty: { textAlign: "center", marginTop: 16, fontSize: 16, color: "gray", marginBottom: 20 },
  bookButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});