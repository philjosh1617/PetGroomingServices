import { View, Text,StyleSheet , TouchableOpacity} from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";



export default function aboutpetprac() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.pageTitle}>Pet Profile</Text>

        <View style={styles.fakeSpacer}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 28,
    color: "#fff",
    fontFamily: "LuckiestGuy",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },

  iconButton: {
    padding: 8,
  },

  fakeSpacer: {
    width: 26,
  },

});