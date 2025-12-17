import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.100.19:3000/api/pets";

export default function EditPet() {
  const router = useRouter();
  const { pet } = useLocalSearchParams();

  const parsedPet = JSON.parse(pet as string);

  const [name, setName] = useState(parsedPet.name);
  const [breed, setBreed] = useState(parsedPet.breed);
  const [size, setSize] = useState(parsedPet.size);
  const [age, setAge] = useState(parsedPet.age?.toString() || "");
  const [treat, setTreat] = useState(parsedPet.treat || "");
  const [behavioralConcern, setBehavioralConcern] = useState(
    parsedPet.behavioralConcern || ""
  );

  /* ================= UPDATE PET ================= */
  const handleUpdatePet = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.put(
        `${API_URL}/${parsedPet._id}`,
        {
          name,
          breed,
          size,
          age,
          treat,
          behavioralConcern,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Pet profile updated", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.log("Update pet error:", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to update pet");
    }
  };

  /* ================= DELETE PET ================= */
  const handleDeletePet = async () => {
    Alert.alert(
      "Delete Pet",
      "Are you sure you want to permanently delete this pet?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");

              await axios.delete(`${API_URL}/${parsedPet._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert("Deleted", "Pet has been deleted", [
                {
                  text: "OK",
                  onPress: () => router.replace("/(tabs)/home"),
                },
              ]);
            } catch (error: any) {
              console.log(
                "Delete pet error:",
                error?.response?.data || error.message
              );
              Alert.alert("Error", "Failed to delete pet");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Pet</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* INPUTS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>NAME</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>BREED</Text>
          <TextInput
            style={styles.input}
            value={breed}
            onChangeText={setBreed}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>SIZE</Text>
          <TextInput style={styles.input} value={size} onChangeText={setSize} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>AGE</Text>
          <TextInput
            style={styles.input}
            value={age}
            keyboardType="numeric"
            onChangeText={setAge}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>TREAT</Text>
          <TextInput
            style={styles.input}
            value={treat}
            onChangeText={setTreat}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>BEHAVIORAL CONCERN</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={behavioralConcern}
            onChangeText={setBehavioralConcern}
          />
        </View>

        {/* SAVE */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdatePet}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
        </TouchableOpacity>

        {/* DELETE */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePet}
          activeOpacity={0.85}
        >
          <Text style={styles.deleteButtonText}>DELETE PET</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 45 : 20,
    paddingBottom: 14,
    backgroundColor: "#143470",
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
    letterSpacing: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#DB6309",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
});
