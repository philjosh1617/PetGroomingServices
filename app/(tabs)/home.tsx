import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet, Image, ImageBackground, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; 

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75; // Main card width (shows peek of next)
const CARD_SPACING = 16;

const Home = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    LuckiestGuy: LuckiestGuy_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // 🐾 Dummy pets data
  const pets = [
    {
      id: 1,
      name: "Spotty",
      breed: "Labrador",
      size: "Large",
      image: require("../../assets/images/dog1.jpg"),
    },
    {
      id: 2,
      name: "Bella",
      breed: "Poodle",
      size: "Medium",
      image: require("../../assets/images/dog2.jpg"),
    },
  ];

  const services = [
    { id: 1, name: "Basic Grooming", icon: "cut", price: "₱350" },
    { id: 2, name: "Flea & Tick Treatment", icon: "bug", price: "₱650" },
    { id: 3, name: "Nail Trimming", icon: "paw", price: "₱150" },
    { id: 4, name: "Teeth Cleaning", icon: "medical", price: "₱250" },
  ];

  const appointments = [
    {
      id: 1,
      pet: "Bella (Poodle)",
      service: "Basic Grooming",
      date: "Sept 16, 2023",
      time: "2:30 PM",
    },
    {
      id: 2,
      pet: "Charlie (Shiba Inu)",
      service: "Nail Trimming",
      date: "Sept 17, 2023",
      time: "4:00 PM",
    },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/homebg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>HOME</Text>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => router.push("/notification")}
          >
            <Ionicons name="notifications" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* 🐶 Pet Profiles Carousel */}
          <View style={{ paddingVertical: 20 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: (width - CARD_WIDTH) / 2,
              }}
            >
              {pets.map((pet) => (
                <View key={pet.id} style={[styles.petProfileCard, { width: CARD_WIDTH }]}>
                  <Text style={styles.profileTitle}>Pet Profile</Text>
                  <View style={styles.profileLine} />
                  <Image source={pet.image} style={styles.petProfileImage} />
                  <Text style={styles.petProfileName}>{pet.name}</Text>
                  <Text style={styles.petProfileSize}>Size: {pet.size}</Text>

                  <View style={styles.profileInfo}>
                    <Text style={styles.profileLabel}>Breed: {pet.breed}</Text>
                    <Text style={styles.profileLabel}>Age:</Text>
                    <Text style={styles.profileLabel}>Treat:</Text>
                    <Text style={styles.profileLabel}>Vaccine:</Text>
                    <Text style={styles.profileLabel}>Behavioral Condition:</Text>
                  </View>

                  <View style={styles.profileLine} />
                  <TouchableOpacity style={styles.startAppointmentButton}>
                    <Text style={styles.startAppointmentText}>START APPOINTMENT</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* ➕ Add Pet Card */}
              <TouchableOpacity
                style={[styles.addPetCard, { width: CARD_WIDTH }]}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle" size={60} color="#143470" />
                <Text style={styles.addPetText}>Add Pet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Promo Card */}
          <LinearGradient colors={["#FF8C00", "#FFB84D"]} style={styles.promoCard}>
            <Text style={styles.promoTitle}>SPECIAL OFFER</Text>
            <Text style={styles.promoText}>
              Get 20% off on your first grooming session!
            </Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Book Now</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Popular Services */}
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.servicesContainer}
          >
            {services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <Ionicons name={service.icon as any} size={28} color="#FF8C00" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Appointments */}
          <Text style={styles.sectionTitle}>Appointments</Text>
          <View style={styles.appointmentsTable}>
            {appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentRow}>
                <View style={styles.appointmentDetails}>
                  <Text style={styles.petName}>{appointment.pet}</Text>
                  <Text style={styles.serviceName}>{appointment.service}</Text>
                  <Text style={styles.appointmentTime}>
                    {appointment.date} • {appointment.time}
                  </Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: { flex: 1 },
  scrollView: { flex: 1 },

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
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  notificationIcon: { padding: 8 },

  // 🐾 Pet Profile Carousel
  petProfileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: CARD_SPACING,
    alignItems: "center",
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  profileTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    alignSelf: "flex-start",
  },
  profileLine: {
    height: 1,
    backgroundColor: "#000",
    width: "100%",
    marginVertical: 8,
  },
  petProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 8,
  },
  petProfileName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  petProfileSize: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  profileInfo: { alignSelf: "flex-start", marginTop: 8 },
  profileLabel: { fontSize: 14, color: "#000", marginBottom: 4 },
  startAppointmentButton: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  startAppointmentText: { color: "#000", fontWeight: "bold" },

  addPetCard: {
    backgroundColor: "#EAF0FF",
    borderRadius: 10,
    marginRight: CARD_SPACING,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 2,
    borderColor: "#143470",
  },
  addPetText: {
    fontSize: 16,
    color: "#143470",
    marginTop: 8,
    fontWeight: "600",
  },

  // Promo
  promoCard: {
    backgroundColor: "#FF8C00",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  promoTitle: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  promoText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 16,
    fontWeight: "600",
  },
  promoButton: {
    backgroundColor: "#FFD54F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  promoButtonText: { color: "#0d3683ff", fontWeight: "bold" },

  // Services & Appointments (unchanged)
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 16,
    color: "#143470",
  },
  servicesContainer: { paddingLeft: 16, marginBottom: 16 },
  serviceCard: {
    backgroundColor: "#fff",
    width: 140,
    height: 160,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF4E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: 4,
  },
  servicePrice: { fontSize: 16, fontWeight: "bold", color: "#FF8C00" },
  appointmentsTable: { marginHorizontal: 16, marginBottom: 100 },
  appointmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  appointmentDetails: { flex: 1 },
  appointmentTime: { fontSize: 14, color: "#7f8c8d", marginTop: 4 },
  viewButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  viewButtonText: { color: "#fff", fontWeight: "600" },
  petName: {},
});

export default Home;
