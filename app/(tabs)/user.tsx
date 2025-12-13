import React from "react";
import {  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMenu } from "../MenuContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const { toggleMenu } = useMenu();

  return (
    <ImageBackground
      source={require("../../assets/images/homebg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>PROFILE</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.notificationIcon}
                onPress={() => router.push("/notification")}
              >
                <Ionicons name="notifications" size={26} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
                <Ionicons name="menu" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView>
          {/* PROFILE SECTION */}
          <View style={styles.profile}>
            <Image
              source={require("../../assets/images/user.jpg")}
              style={styles.avatar}
            />
            <Text style={styles.name}>Phil Josh Burlat</Text>
            <Text style={styles.email}>levi@yahoo.com</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* PETS SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.petCard}>
                <Image
                  source={require("../../assets/images/dog1.jpg")}
                  style={styles.petImage}
                />
                <Text style={styles.petName}>Buddy</Text>
                <Text style={styles.petBreed}>Golden Retriever</Text>
              </View>

              <View style={styles.petCard}>
                <Image
                  source={require("../../assets/images/olaf.jpg")}
                  style={styles.petImage}
                />
                <Text style={styles.petName}>Mochi</Text>
                <Text style={styles.petBreed}>Pe</Text>
              </View>

            <TouchableOpacity style={styles.addPetBtn} onPress={() => router.push("/PetProfile/aboutpet")}>
                <Ionicons name="add-circle-outline" size={30} color="#ffffffff" />
                <Text style={styles.addText}>Add Pet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>


          {/* MY PHOTOS SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.photoFrameContainer}>
              <View style={styles.photoGrid}>
                <Image
                  source={require("../../assets/images/cat2.jpg")}
                  style={styles.photoItem}
                />
                <Image
                  source={require("../../assets/images/dog1.jpg")}
                  style={styles.photoItem}
                />
                <Image
                  source={require("../../assets/images/cat1.jpg")}
                  style={styles.photoItem}
                />
                <Image
                  source={require("../../assets/images/cat3.jpg")}
                  style={styles.photoItem}
                />
                <Image
                  source={require("../../assets/images/cat5.jpg")}
                  style={styles.photoItem}
                />
                <Image
                  source={require("../../assets/images/dog4.jpg")}
                  style={styles.photoItem}
                />
              </View>

              {/* Add Photo Button */}
              <TouchableOpacity style={styles.addPhotoBox}>
                <Ionicons name="add" size={40} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },

  notificationIcon: { padding: 5 },
  menuIcon: { padding: 5 },

  profile: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },

  name: { fontSize: 20, fontWeight: "700" },
  email: { color: "#777" },

  editBtn: {
    backgroundColor: "#FFA726",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 10,
  },

  editText: { 
    color: "#fff", 
    fontWeight: "600" 
  },

  section: { 
    paddingHorizontal: 20, 
    marginBottom: 25
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 10 
  },

  petCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    width: 130,
    alignItems: "center",
  },

  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
  },

  petName: { 
    fontWeight: "700", 
    marginTop: 3 
  },
  petBreed: { 
    fontSize: 12, 
    color: "#777" 
  },

  addPetBtn: {
    backgroundColor: "#FFD180",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    marginRight: 10,
  },

  addText: { 
    color: "#333", 
    fontWeight: "600" 
  },

  /** --- MY PHOTOS --- **/

  photoFrameContainer: {
    backgroundColor: "#D6D1C9", // similar to your sample beige-gray
    borderWidth: 1,
    borderColor: "#555",
    padding: 5,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    height: 355,
    marginBottom: 70,
  },

  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  photoItem: {
    width: "32%",
    aspectRatio: 1,
    marginBottom: 5,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#333",
  },

  addPhotoBox: {
    marginTop: 2,
    borderWidth: 1.5,
    borderColor: "#777",
    borderStyle: "dashed",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width:"32%",
    backgroundColor: "#f7f7f7",
  },
});

