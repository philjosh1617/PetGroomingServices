import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const CARD_SPACING = 16;
const API_URL = 'http://192.168.100.19:3000/api/pets';
const APPOINTMENTS_API_URL = 'http://192.168.100.19:3000/api/appointments';

interface Pet {
  _id: string;
  name: string;
  breed: string;
  size: string;
  age?: string;
  treat?: string;
  medicalCondition?: string;
  behavioralConcern?: string;
  rabiesExpiry?: string;
  profileImage: string;
}

interface Appointment {
  _id: string;
  services: { serviceName: string; price: number }[];
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  totalAmount: number;
  petId: {
    name: string;
    profileImage: string;
  };
}

const Home = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch pets from backend
  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      setPets(response.data);
    } catch (error: any) {
      console.log("Failed to fetch pets:", error?.response?.data || error.message);
    }
  };

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(APPOINTMENTS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      setAppointments(response.data);
    } catch (error: any) {
      console.log("Failed to fetch appointments:", error?.response?.data || error.message);
    }
  };

  // Load user data and pets
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username);
      }

      await fetchPets();
      await fetchAppointments();
    } catch (error) {
      console.log("Failed to load user data", error);
    }
  };

  // Initial load
  useEffect(() => {
    loadUserData();
  }, []);

  // Reload pets when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPets();
      fetchAppointments();
    }, [])
  );

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPets();
    await fetchAppointments();
    setRefreshing(false);
  };

  const handleAddPet = () => {
    router.push("/PetProfile/aboutpet");
  };

  // ✅ NEW: Map service names to service IDs in Services screen
  const serviceNameToId: { [key: string]: string } = {
    "Basic Grooming": "2", // Bath & Blow Dry
    "Flea & Tick Treatment": "1", // Flea Treatment
    "Nail Trimming": "4",
    "Teeth Cleaning": "3", // Teeth Brushing
  };

  // ✅ NEW: Handle popular service click
  const handleServiceClick = (serviceName: string) => {
    const serviceId = serviceNameToId[serviceName];
    if (serviceId) {
      // Navigate to Services screen with pre-selected service
      router.push({
        pathname: "/Services",
        params: { preSelectedService: serviceId }
      });
    }
  };

  const services = [
    { id: 1, name: "Basic Grooming", icon: "cut", price: "₱350" },
    { id: 2, name: "Flea & Tick Treatment", icon: "bug", price: "₱650" },
    { id: 3, name: "Nail Trimming", icon: "paw", price: "₱150" },
    { id: 4, name: "Teeth Cleaning", icon: "medical", price: "₱250" },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/homebg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>HOME</Text>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => router.push("/notification")}
          >
            <Ionicons name="notifications" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingName}>{username || "User"}</Text>
            <View style={styles.greetingDivider} />
          </View>

          {/* Pet Profiles */}
          <View style={{ paddingVertical: 20 }}>
            {pets.length === 0 ? (
              <View style={styles.emptyPetContainer}>
                <View style={[styles.emptyPetCard, { width: CARD_WIDTH }]}>
                  <Text style={styles.profileTitle}>Pet Profile</Text>
                  <View style={styles.profileLine} />
                  
                  <View style={styles.emptyImagePlaceholder}>
                    <Ionicons name="paw" size={40} color="#ccc" />
                  </View>
                  
                  <Text style={styles.emptyPetName}>-</Text>
                  <Text style={styles.petProfileSize}>Size: -</Text>

                  <View style={styles.profileInfo}>
                    <Text style={styles.profileLabel}>Breed: -</Text>
                    <Text style={styles.profileLabel}>Age: -</Text>
                    <Text style={styles.profileLabel}>Treat: -</Text>
                    <Text style={styles.profileLabel}>Vaccine: -</Text>
                    <Text style={styles.profileLabel}>Behavioral Condition: -</Text>
                  </View>

                  <View style={styles.profileLine} />
                  <TouchableOpacity
                    style={styles.addPetButtonEmpty}
                    onPress={handleAddPet}
                  >
                    <Text style={styles.addPetButtonText}>ADD PET</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
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
                  <View key={pet._id} style={[styles.petProfileCard, { width: CARD_WIDTH }]}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() =>
                          router.push({
                            pathname: "/PetProfile/editpet",
                            params: {
                              pet: JSON.stringify(pet),
                            },
                          })
                        }
                      >
                        <Ionicons name="create-outline" size={26} color="#143470" />
                      </TouchableOpacity>

                    <Text style={styles.profileTitle}>Pet Profile</Text>
                    <View style={styles.profileLine} />
                    
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: pet.profileImage }}
                        style={styles.petProfileImage}
                        onError={(e) => console.log("Image error:", e.nativeEvent.error)}
                      />
                    </View>
                    
                    <Text style={styles.petProfileName}>{pet.name}</Text>
                    <Text style={styles.petProfileSize}>Size: {pet.size}</Text>

                    <View style={styles.profileInfo}>
                      <Text style={styles.profileLabel}>Breed: {pet.breed}</Text>
                      <Text style={styles.profileLabel}>Age: {pet.age || "N/A"}</Text>
                      <Text style={styles.profileLabel}>Treat: {pet.treat || "N/A"}</Text>
                      <Text style={styles.profileLabel}>Vaccine: {pet.rabiesExpiry || "N/A"}</Text>
                      <Text style={styles.profileLabel}>
                        Behavioral Condition: {pet.behavioralConcern || "N/A"}
                      </Text>
                    </View>

                    <View style={styles.profileLine} />
                    <TouchableOpacity
                      style={styles.startAppointmentButton}
                      onPress={() => router.push("/(tabs)/booking")}
                    >
                      <Text style={styles.startAppointmentText}>START APPOINTMENT</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Add Pet Card at the end */}
                <View style={[styles.emptyPetCard, { width: CARD_WIDTH }]}>
                  <Text style={styles.profileTitle}>Pet Profile</Text>
                  <View style={styles.profileLine} />
                  
                  <View style={styles.emptyImagePlaceholder}>
                    <Ionicons name="paw" size={40} color="#ccc" />
                  </View>
                  
                  <Text style={styles.emptyPetName}>-</Text>
                  <Text style={styles.petProfileSize}>Size: -</Text>

                  <View style={styles.profileInfo}>
                    <Text style={styles.profileLabel}>Breed: -</Text>
                    <Text style={styles.profileLabel}>Age: -</Text>
                    <Text style={styles.profileLabel}>Treat: -</Text>
                    <Text style={styles.profileLabel}>Vaccine: -</Text>
                    <Text style={styles.profileLabel}>Behavioral Condition: -</Text>
                  </View>

                  <View style={styles.profileLine} />
                  <TouchableOpacity
                    style={styles.addPetButtonEmpty}
                    onPress={handleAddPet}
                  >
                    <Text style={styles.addPetButtonText}>ADD PET</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>

          <LinearGradient colors={["#FF8C00", "#FFB84D"]} style={styles.promoCard}>
            <Text style={styles.promoTitle}>SPECIAL OFFER</Text>
            <Text style={styles.promoText}>
              Get 20% off on your first grooming session!
            </Text>
            <TouchableOpacity 
              style={styles.promoButton}
              onPress={() => router.push("/(tabs)/booking")}
            >
              <Text style={styles.promoButtonText}>Book Now</Text>
            </TouchableOpacity>
          </LinearGradient>

          <Text style={styles.sectionTitle}>Popular Services</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.servicesContainer}
          >
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceCard}
                onPress={() => handleServiceClick(service.name)}
                activeOpacity={0.7}
              >
                <View style={styles.serviceIcon}>
                  <Ionicons name={service.icon as any} size={28} color="#FF8C00" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Appointments</Text>
          {appointments.length === 0 ? (
            <View style={styles.emptyAppointments}>
              <Ionicons name="calendar-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No appointments yet</Text>
              <TouchableOpacity
                style={styles.bookNowButton}
                onPress={() => router.push("/(tabs)/booking")}
              >
                <Text style={styles.bookNowText}>Book Your First Appointment</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.appointmentsTable}>
              {appointments.map((appointment) => (
                <View key={appointment._id} style={styles.appointmentRow}>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.petName}>{appointment.petId?.name || "Unknown Pet"}</Text>
                    <Text style={styles.serviceName}>
                      {appointment.services.map(s => s.serviceName).join(", ")}
                    </Text>
                    <Text style={styles.appointmentTime}>
                      {appointment.appointmentDate} • {appointment.appointmentTime}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => router.push("/(tabs)/appointment")}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
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
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  notificationIcon: { padding: 8 },
  greetingContainer: { paddingHorizontal: 20 },
  greetingName: {
    fontSize: 31,
    fontFamily: "Poppins_600SemiBold",
    color: "#4A4A4A",
    marginTop: 10,
  },
  greetingDivider: { height: 1.5, backgroundColor: "#000", opacity: 1 },
  petProfileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: CARD_SPACING,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: "relative",
  },
  deleteButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },
  profileTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#000", 
    alignSelf: "flex-start" 
  },
  profileLine: { 
    height: 1, 
    backgroundColor: "#000", 
    width: "100%", 
    marginVertical: 8 
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 8,
  },
  petProfileImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40,
  },
  petProfileName: { 
    fontWeight: "bold", 
    fontSize: 18, 
    color: "#000",
    textAlign: "center",
    width: "100%",
  },
  petProfileSize: { 
    fontSize: 14, 
    color: "#777", 
    marginBottom: 8,
    textAlign: "center",
    width: "100%",
  },
  profileInfo: { 
    alignSelf: "flex-start", 
    marginTop: 8,
    width: "100%",
  },
  profileLabel: { 
    fontSize: 14, 
    color: "#000", 
    marginBottom: 4 
  },
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
  addPetText: { fontSize: 16, color: "#143470", marginTop: 8, fontWeight: "600" },
  promoCard: { backgroundColor: "#FF8C00", margin: 16, padding: 20, borderRadius: 12, elevation: 3 },
  promoTitle: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  promoText: { fontSize: 18, color: "#fff", marginBottom: 16, fontWeight: "600" },
  promoButton: {
    backgroundColor: "#FFD54F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  promoButtonText: { color: "#0d3683ff", fontWeight: "bold" },
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
  emptyAppointments: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyText: { fontSize: 16, color: "#999", marginTop: 12, marginBottom: 20 },
  bookNowButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookNowText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  appointmentsTable: { marginHorizontal: 16, marginBottom: 16 },
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
  petName: { fontSize: 16, fontWeight: "600", color: "#2c3e50" },
  appointmentTime: { fontSize: 14, color: "#7f8c8d", marginTop: 4 },
  viewButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  viewButtonText: { color: "#fff", fontWeight: "600" },
  emptyPetContainer: { alignItems: "center", justifyContent: "center" },
  emptyPetCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginRight: CARD_SPACING,
  },
  emptyImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    alignSelf: "center",
  },
  emptyPetName: { 
    fontWeight: "bold", 
    fontSize: 18,
    color: "#ccc", 
    marginTop: 8,
    textAlign: "center",
    width: "100%",
  },
  addPetButtonEmpty: {
    borderWidth: 2,
    borderColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  addPetButtonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});

export default Home;