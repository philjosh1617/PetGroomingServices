import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function NotificationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.pageTitle}>NOTIFICATIONS</Text>

        {/* Notification bell (optional placeholder) */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Notification list */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Happy Paws</Text>
          <Text style={styles.notificationText}>
            "Welcome to HappyPaws! We're so glad to have you! Let's make today
            pawsome for you and your furry friend!"
          </Text>
          <Text style={styles.notificationDate}>Date: Sept 16, 2025 - 10:15 AM</Text>
        </View>

        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Special Offer</Text>
          <Text style={styles.notificationText}>
            "Enjoy a special 20% off on your pet’s first grooming session — treat
            your pup to a fresh new look today!"
          </Text>
          <Text style={styles.notificationDate}>Date: Sept 16, 2025 - 3:22 PM</Text>
        </View>

        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Appointment</Text>
          <Text style={styles.notificationText}>
            "Your grooming appointment for Buddy has been successfully confirmed!
            We look forward to pampering him soon."
          </Text>
          <Text style={styles.notificationDate}>Date: Sept 19, 2025 - 11:30 AM</Text>
        </View>

        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Update</Text>
          <Text style={styles.notificationText}>
            "Version 1.5.7 is now available! Update now to enjoy the latest
            features and improvements."
          </Text>
          <Text style={styles.notificationDate}>Date: Sept 18, 2025 - 4:30 PM</Text>
        </View>

        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Pets</Text>
          <Text style={styles.notificationText}>
            "🎉 Buddy is now part of the HappyPaws family! We can't wait to give
            him a fun and relaxing grooming experience!"
          </Text>
          <Text style={styles.notificationDate}>Date: Sept 19, 2025 - 4:30 PM</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
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
    fontFamily: "LuckiestGuy",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },

  scrollContainer: {
    padding: 15,
  },

  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 6,
    borderLeftColor: "#FFB74D",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },

  notificationText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },

  notificationDate: {
    fontSize: 12,
    color: "#777",
  },
});
