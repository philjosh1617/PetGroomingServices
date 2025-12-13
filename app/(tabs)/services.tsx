import React, { useState } from "react";
import {  View,  Text,  StyleSheet,  Image,TouchableOpacity, FlatList,Modal, TextInput,  ImageBackground,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Service = {
  id: string;
  name: string;
  price: string;
  image: any;
  description: string;
};

const services: Service[] = [
  {
    id: "1",
    name: "Flea Treatment",
    price: "₱350",
    image: require("../../assets/images/service1.png"),
    description:
      "Gently removes and protects your pet from fleas using safe, approved products – keeping them clean, comfortable, and worry-free!",
  },
  {
    id: "2",
    name: "Bath & Blow Dry",
    price: "₱350",
    image: require("../../assets/images/service2.png"),
    description:
      "Give your furry friend the refresh they deserve! Our Bath & Blow Dry includes warm bath and blow dry that keeps your pet fresh between grooming sessions.",
  },
  {
    id: "3",
    name: "Teeth Brushing",
    price: "₱200",
    image: require("../../assets/images/service3.png"),
    description:
      "Keep those pearly whites sparkling! We use pet-friendly toothpaste to clean teeth and gums for a healthier smile.",
  },
  {
    id: "4",
    name: "Nail Trimming",
    price: "₱150",
    image: require("../../assets/images/service4.png"),
    description:
      "Careful nail trimming to keep your pet's paws neat and comfortable – no stress!",
  },
  {
    id: "5",
    name: "Ear Cleaning",
    price: "₱180",
    image: require("../../assets/images/service5.png"),
    description:
      "Gentle ear cleaning to remove dirt and wax, preventing irritations and keeping your pet healthy.",
  },
  {
    id: "6",
    name: "Haircut",
    price: "₱400",
    image: require("../../assets/images/service3.png"),
    description:
      "Professional pet haircut tailored to breed and style preference — keeps your furry friend clean, cool, and looking their best!",
  },
  {
    id: "7",
    name: "Full Grooming",
    price: "₱600",
    image: require("../../assets/images/service6.png"),
    description:
      "Our all-in-one grooming includes bath, blow-dry, haircut, nail trimming, and ear cleaning for a polished finish.",
  },
];

export default function Services() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);


  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartAppointment = () => {
    setSelectedService(null); // Close modal
    router.push("/Services"); // Navigate to Services screen
  };

  const renderService = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedService(item)}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Ionicons name="star" size={14} color="#FFB800" />
            <Ionicons name="star" size={14} color="#FFB800" />
            <Ionicons name="star" size={14} color="#FFB800" />
            <Ionicons name="star-outline" size={14} color="#FFB800" />
          </View>

          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../assets/images/homebg.png")}
      style={styles.background}
    >
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>SERVICES</Text>
          <TouchableOpacity onPress={() => router.push("/notification")}>
            <Ionicons name="notifications" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#555" />
          <TextInput
            placeholder="Types of Services"
            placeholderTextColor="#777"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        {/* MODAL */}
        <Modal visible={!!selectedService} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedService && (
                <>
                  <Image source={selectedService.image} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{selectedService.name}</Text>
                  <Text style={styles.modalDescription}>{selectedService.description}</Text>
                  <Text style={styles.modalPrice}>Price: {selectedService.price}</Text>

                  <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={handleStartAppointment}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.bookButtonText}>Start Appointment</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => setSelectedService(null)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.closeText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },

  header: {
    backgroundColor: "#143470",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "LuckiestGuy_400Regular",
  },

  searchBar: {
    backgroundColor: "#fff",
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
    color: "#000",
  },

  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardImage: {
    width: 68,
    height: 68,
    borderRadius: 14,
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 6 },
  cardDescription: { fontSize: 12, color: "#555", marginBottom: 10 },
  ratingRow: { flexDirection: "row" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardPrice: { fontWeight: "bold", fontSize: 15, color: "#143470" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "85%",
    borderRadius: 18,
    alignItems: "center",
  },
  modalImage: { width: 120, height: 120, borderRadius: 14, marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalDescription: { textAlign: "center", color: "#666", marginBottom: 12 },
  modalPrice: { fontWeight: "bold", fontSize: 16, marginBottom: 18 },
  bookButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 10,
    borderRadius: 10,
    width: "75%",
    alignItems: "center",
    marginBottom: 10,
  },
  bookButtonText: { color: "#fff", fontWeight: "bold" },
  closeText: { color: "#143470", fontWeight: "bold" },
});