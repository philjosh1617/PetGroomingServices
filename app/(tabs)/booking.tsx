import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { useRouter } from "expo-router";

export default function Booking() {
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

  return (
    <ImageBackground
      source={require("../../assets/images/homebg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>BOOKING</Text>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Ionicons name="notifications" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.container}>
        <Text style={styles.headingText}>Ready to Book?</Text>
        <Text style={styles.subText}>
          Schedule grooming and wellness services for your pet with ease.
        </Text>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.push("/services")}
          >
            <Text style={styles.selectButtonText}>SERVICE & APPOINTMENT</Text>
          </TouchableOpacity>
        </View>
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

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 150,
  },

  headingText: {
    fontSize: 28,
    color: "#143470",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    marginBottom: 8,
  },

  subText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  buttonWrapper: {
    marginTop: 40,
  },

  selectButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 8,
    elevation: 5,
  },

  selectButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});
