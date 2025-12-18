import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMenu } from "../MenuContext";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LuckiestGuy_400Regular } from '@expo-google-fonts/luckiest-guy';

const API_URL = "http://192.168.100.19:3000/api";
const MAX_PHOTOS = 6;

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface Pet {
  _id: string;
  name: string;
  breed: string;
  profileImage: string;
}

interface Photo {
  _id?: string;
  uri: string;
  uploadedAt?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { toggleMenu } = useMenu();

  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    LuckiestGuy_400Regular,
  });

  const getProfileImageUrl = (profileImage?: string) => {
  console.log("=== DEBUG PROFILE IMAGE ===");
  console.log("Input profileImage:", profileImage);
  console.log("User object:", user);
  
  // If no profile image or empty string, use DiceBear PNG (works in React Native!)
  if (!profileImage || profileImage.trim() === "") {
    const name = user?.username || user?.email || 'User';
    const avatarUrl = `https://api.dicebear.com/9.x/croodles/png?seed=${encodeURIComponent(name)}&size=200`;
    console.log("Generated DiceBear PNG avatar:", avatarUrl);
    return avatarUrl;
  }
  
  // ✅ REMOVED: No longer need to convert dicebear URLs since they're now PNG
  // dicebear.com PNG URLs work perfectly in React Native!
  
  // If it's already a full URL (http/https), return it
  if (profileImage.startsWith('http')) {
    console.log("Using full URL:", profileImage);
    return profileImage;
  }
  
  // Otherwise, it's a relative path from our server
  const fullUrl = `http://192.168.100.19:3000${profileImage}`;
  console.log("Using relative path, full URL:", fullUrl);
  return fullUrl;
};

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log("📦 Loaded user from AsyncStorage:", parsedUser);
        setUser(parsedUser);
        setEditUsername(parsedUser.username);
        setEditEmail(parsedUser.email);
      }

      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const freshUser = response.data;
          console.log("🔄 Fresh user from API:", freshUser);
          await AsyncStorage.setItem("user", JSON.stringify(freshUser));
          setUser(freshUser);
          setEditUsername(freshUser.username);
          setEditEmail(freshUser.email);
        } catch (error) {
          console.log("Could not fetch fresh user data:", error);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPets(response.data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    }
  };

  const fetchPhotos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/user/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transformedPhotos = (response.data || []).map((photo: any) => ({
        _id: photo._id,
        uri: photo.imageUrl?.startsWith('http') 
          ? photo.imageUrl 
          : `http://192.168.100.19:3000${photo.imageUrl}`,
        uploadedAt: photo.uploadedAt,
      }));
      
      setPhotos(transformedPhotos);
    } catch (error: any) {
      console.error("Failed to fetch photos:", error?.response?.data || error.message);
      setPhotos([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!fontsLoaded) return;
      setLoading(true);
      await fetchUserData();
      await fetchPets();
      await fetchPhotos();
      setLoading(false);
    };
    loadData();
  }, [fontsLoaded]);

  useFocusEffect(
    useCallback(() => {
      if (fontsLoaded) {
        fetchUserData();
        fetchPets();
        fetchPhotos();
      }
    }, [fontsLoaded])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchPets();
    await fetchPhotos();
    setRefreshing(false);
  };

  const handleUpdateProfile = async () => {
    if (!editUsername.trim() || !editEmail.trim()) {
      Alert.alert("Error", "Username and email are required");
      return;
    }

    setSaving(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        { username: editUsername, email: editEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (imageUri: string, type: 'profile' | 'photo') => {
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('image', {
        uri: imageUri,
        name: `${type}_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      const endpoint = type === 'profile' 
        ? `${API_URL}/auth/upload-profile-image`
        : `${API_URL}/user/upload-photo`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  const handleChangeProfilePicture = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingProfile(true);
        
        try {
          const response = await uploadImage(result.assets[0].uri, 'profile');
          
          const imageUrl = response.imageUrl?.startsWith('http')
            ? response.imageUrl
            : `http://192.168.100.19:3000${response.imageUrl}`;
          
          const updatedUser = { ...user, profileImage: imageUrl } as User;
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          Alert.alert("Success", "Profile picture updated successfully!");
        } catch (error: any) {
          Alert.alert("Error", error.response?.data?.message || "Failed to upload profile picture");
        } finally {
          setUploadingProfile(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      setUploadingProfile(false);
    }
  };

  const handleAddPhoto = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert("Gallery Full", `You can only have up to ${MAX_PHOTOS} photos in your gallery.`);
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingPhoto(true);
        
        try {
          const response = await uploadImage(result.assets[0].uri, 'photo');
          
          const imageUrl = response.imageUrl?.startsWith('http')
            ? response.imageUrl
            : `http://192.168.100.19:3000${response.imageUrl}`;
          
          setPhotos([...photos, { 
            _id: response._id, 
            uri: imageUrl,
            uploadedAt: new Date().toISOString()
          }]);
          
          Alert.alert("Success", "Photo added successfully!");
        } catch (error: any) {
          Alert.alert("Error", error.response?.data?.message || "Failed to upload photo");
        } finally {
          setUploadingPhoto(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              
              await axios.delete(`${API_URL}/user/photos/${photoId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setPhotos(photos.filter(p => p._id !== photoId));
              Alert.alert("Success", "Photo deleted successfully!");
            } catch (error: any) {
              Alert.alert("Error", error.response?.data?.message || "Failed to delete photo");
            }
          },
        },
      ]
    );
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#143470" />
      </View>
    );
  }

  // 🔍 DEBUG LOGS - This is where we check what's happening
  console.log("=== RENDER DEBUG ===");
  console.log("Current user state:", user);
  console.log("User profileImage value:", user?.profileImage);

  const profileImageUrl = getProfileImageUrl(user?.profileImage);
  console.log("Final profileImageUrl:", profileImageUrl);

  return (
    <ImageBackground
      source={require("../../assets/images/homebg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
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

        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* PROFILE SECTION */}
          <View style={styles.profile}>
            <TouchableOpacity onPress={handleChangeProfilePicture} disabled={uploadingProfile}>
              {uploadingProfile ? (
                <View style={styles.avatarLoading}>
                  <ActivityIndicator size="large" color="#FF8C00" />
                </View>
              ) : (
                <>
                  <Image source={{ uri: profileImageUrl }} style={styles.avatar} />
                  <View style={styles.cameraIconContainer}>
                    <Ionicons name="camera" size={20} color="#fff" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.name}>{user?.username || "User"}</Text>
            <Text style={styles.email}>{user?.email || "email@example.com"}</Text>

            <TouchableOpacity style={styles.editBtn} onPress={() => setEditModalVisible(true)}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* PETS SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet._id}
                  style={styles.petCard}
                  onPress={() =>
                    router.push({
                      pathname: "/PetProfile/editpet",
                      params: { pet: JSON.stringify(pet) },
                    })
                  }
                >
                  <Image source={{ uri: pet.profileImage }} style={styles.petImage} />
                  <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
                  <Text style={styles.petBreed} numberOfLines={1}>{pet.breed}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.addPetBtn}
                onPress={() => router.push("/PetProfile/aboutpet")}
              >
                <Ionicons name="add-circle-outline" size={50} color="#333" />
                <Text style={styles.addText}>Add Pet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* PHOTOS SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Photos {photos.length > 0 && `(${photos.length}/${MAX_PHOTOS})`}
            </Text>
            <View style={styles.photoFrameContainer}>
              <View style={styles.photoGrid}>
                {/* Add Photo Button - Only show if less than MAX_PHOTOS */}
                {photos.length < MAX_PHOTOS && (
                  <TouchableOpacity 
                    style={styles.addPhotoBox}
                    onPress={handleAddPhoto}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <ActivityIndicator color="#999" />
                    ) : (
                      <Ionicons name="add" size={40} color="#999" />
                    )}
                  </TouchableOpacity>
                )}

                {/* Display Photos */}
                {photos.slice(0, MAX_PHOTOS).map((photo, index) => (
                  <TouchableOpacity
                    key={photo._id || index}
                    style={styles.photoItem}
                    onLongPress={() => photo._id && handleDeletePhoto(photo._id)}
                  >
                    <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={styles.photoHint}>
              {photos.length < MAX_PHOTOS 
                ? "Tap + to add photos • Long press to delete"
                : `Gallery full (${MAX_PHOTOS}/${MAX_PHOTOS}) • Long press to delete`}
            </Text>
          </View>
        </ScrollView>

        {/* Edit Profile Modal */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={editUsername}
                  onChangeText={setEditUsername}
                  placeholder="Enter username"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                  onPress={handleUpdateProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
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
  profile: { alignItems: "center", marginTop: 25, marginBottom: 20, paddingHorizontal: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10, borderWidth: 3, borderColor: "#FF8C00" },
  avatarLoading: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    backgroundColor: "#FF8C00",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { fontSize: 20, fontWeight: "700", fontFamily: "Poppins_600SemiBold" },
  email: { color: "#777", fontFamily: "Poppins_400Regular" },
  editBtn: { backgroundColor: "#FFA726", paddingVertical: 8, paddingHorizontal: 18, borderRadius: 10, marginTop: 10 },
  editText: { color: "#fff", fontWeight: "600", fontFamily: "Poppins_600SemiBold" },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, fontFamily: "Poppins_700Bold" },
  petCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    width: 130,
    height: 160,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 4 },
  petName: { fontWeight: "700", fontFamily: "Poppins_600SemiBold", fontSize: 14, textAlign: "center" },
  petBreed: { fontSize: 12, color: "#777", fontFamily: "Poppins_400Regular", textAlign: "center" },
  addPetBtn: {
    backgroundColor: "#FFD180",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 130,
    height: 160,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addText: { color: "#333", fontWeight: "600", fontFamily: "Poppins_600SemiBold", marginTop: 5, fontSize: 14 },
  photoFrameContainer: {
    backgroundColor: "#D6D1C9",
    borderWidth: 1,
    borderColor: "#555",
    padding: 5,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    minHeight: 230,
  },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },
  addPhotoBox: {
    width: "32%",
    aspectRatio: 1,
    margin: "0.5%",
    borderWidth: 2,
    borderColor: "#777",
    borderStyle: "dashed",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  photoItem: {
    width: "32%",
    aspectRatio: 1,
    margin: "0.5%",
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  photoImage: { width: "100%", height: "100%", resizeMode: "cover" },
  photoHint: { marginTop: 8, marginBottom: 50, fontSize: 12, color: "#666", textAlign: "center", fontFamily: "Poppins_400Regular" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 20, width: "90%", maxWidth: 400 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },
  inputGroup: { marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 6, fontFamily: "Poppins_600SemiBold" },
  input: { backgroundColor: "#F8F9FA", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, color: "#000" },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 10 },
  cancelButton: { flex: 1, backgroundColor: "#999", padding: 14, borderRadius: 8, alignItems: "center" },
  cancelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, fontFamily: "Poppins_600SemiBold" },
  saveButton: { flex: 1, backgroundColor: "#FF8C00", padding: 14, borderRadius: 8, alignItems: "center" },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, fontFamily: "Poppins_600SemiBold" },
});