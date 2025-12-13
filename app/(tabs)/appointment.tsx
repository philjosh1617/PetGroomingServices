import React from "react";
import {View,Text,StyleSheet, FlatList, TouchableOpacity, ImageBackground} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Appointment = {
  id: string;
  service: string;
  date: string;
  status: "Pending" | "Complete";
};

const appointments: Appointment[] = [
  {
    id: "1",
    service: "Nail Trimming | Flea Treatment",
    date: "Nov 11, 2025 / 1:30 PM",
    status: "Complete",
  },
  {
    id: "2",
    service: "Full Grooming",
    date: "Nov 11, 2025 / 1:30 PM",
    status: "Pending",
  },
  {
    id: "3",
    service: "Full Grooming",
    date: "Nov 9, 2025 / 3:00 PM",
    status: "Pending",
  },
];

export default function AppointmentScreen() {
  const router = useRouter();

  const renderStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return { backgroundColor: "#143470" };
      case "Pending":
        return { backgroundColor: "#FFA500" };
      default:
        return { backgroundColor: "gray" };
    }
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

        {/* Appointment List */}
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Types of Services</Text>
              </View>
              
              {/* Service and Date */}
              <View style={styles.serviceRow}>
                <Text style={styles.serviceLabel}>Service:</Text>
                <Text style={styles.serviceText}>{item.service}</Text>
              </View>
              
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Date:</Text>
                <Text style={styles.dateText}>{item.date}</Text>
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
            <Text style={styles.empty}>No appointments yet. Book now!</Text>
          }
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
  },

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

  notificationIcon: {
    padding: 8,
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
  
  sectionHeader: {
    marginBottom: 12,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  
  serviceRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  
  serviceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: 70,
  },
  
  serviceText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  
  dateRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: 70,
  },
  
  dateText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  
  statusSection: {
    marginTop: 8,
  },
  
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
});