import React from "react";
import {View,Text,StyleSheet, FlatList, TouchableOpacity, ImageBackground} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { useRouter } from "expo-router";

type Appointment = {
  id: string;
  pet: string;
  service: string;
  date: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

const appointments: Appointment[] = [
  {
    id: "1",
    pet: "Buddy 🐶",
    service: "Grooming",
    date: "Sept 20, 2025 | 2:00 PM",
    status: "Confirmed",
  },
  {
    id: "2",
    pet: "Mittens 🐱",
    service: "Vaccination",
    date: "Sept 22, 2025 | 11:00 AM",
    status: "Pending",
  },
  {
    id: "3",
    pet: "Charlie 🐕",
    service: "Check-up",
    date: "Sept 25, 2025 | 4:30 PM",
    status: "Completed",
  },
];

export default function AppointmentScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    LuckiestGuy_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return { backgroundColor: "green" };
      case "Pending":
        return { backgroundColor: "orange" };
      case "Completed":
        return { backgroundColor: "blue" };
      case "Cancelled":
        return { backgroundColor: "red" };
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
              <Text style={styles.petName}>{item.pet}</Text>
              <Text style={styles.text}>Service: {item.service}</Text>
              <Text style={styles.text}>Date: {item.date}</Text>

              {/* Status Badge */}
              <View style={[styles.statusBadge, renderStatusColor(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
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
    fontFamily: "LuckiestGuy",
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
    marginBottom: 12,
    elevation: 2,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
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
