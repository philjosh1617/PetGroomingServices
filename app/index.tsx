import React, { useState, useEffect } from "react";
import {  View,  Text, StyleSheet, TouchableOpacity, Image,} from "react-native";
import { Link } from "expo-router";
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import Animated, {  useSharedValue,  useAnimatedStyle,  withRepeat,  withTiming,  withSequence,} from "react-native-reanimated";
import { MotiView, MotiText } from "moti";
import { Easing } from "react-native-reanimated";

export default function Index() {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });
  const [welcomeText, setWelcomeText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [subtitleText, setSubtitleText] = useState("");
  const [showUnderline, setShowUnderline] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const scale = useSharedValue(0); 

  useEffect(() => {
    // Delay logo pop until after "Welcome to.." shows
    setTimeout(() => {
      scale.value = withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.out(Easing.exp) }), // POP + BOING
        withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }, () => {
          // After bounce, start breathing effect forever
          scale.value = withRepeat(
            withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
          );
        })
      );
    }, 3100); 
  }, []);

  const animatedLogo = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    const typeText = (
      setter: React.Dispatch<React.SetStateAction<string>>,
      message: string,
      delay = 0,
      onFinish?: () => void
    ) => {
      let i = 0;
      setTimeout(() => {
        const interval = setInterval(() => {
          setter(message.slice(0, i++));
          if (i > message.length) {
            clearInterval(interval);
            if (onFinish) onFinish();
          }
        }, 100);
      }, delay);
    };

    typeText(setWelcomeText, "Welcome to..", 0);
    typeText(setTitleText, "HAPPY PAWS", 3800, () => {
      setTimeout(() => setShowUnderline(true), 0);
    });
    typeText(setSubtitleText, "Happy Pet, Happy Owner", 6000, () => {
      setTimeout(() => setShowButton(true), 10);
    });
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Welcome Text */}
      <MotiText
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200, duration: 800 }}
        style={styles.welcomeTo}
      >
        {welcomeText}
      </MotiText>

      {/* 🐾 Delayed Pop + Bounce + Breathing Logo */}
      <Animated.View style={[styles.logoContainer, animatedLogo]}>
        <Image
          source={require("../assets/images/logo (1).png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Logo Text + Underline */}
      <View style={styles.textContainer}>
        <Text style={styles.logoText}>{titleText}</Text>
        {showUnderline && <View style={styles.underline} />}
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{subtitleText}</Text>

      {/* Button */}
      {showButton && (
        <MotiView
          from={{ opacity: 0, translateY: 100 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "spring",
            damping: 10,   // lower = bouncier
            stiffness: 100,
            delay: 900
          }}
          style={styles.buttonContainer}
        >
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.getStartBtn}>
              <Text style={styles.getStartText}>Get Started</Text>
            </TouchableOpacity>
          </Link>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    backgroundColor: "#143470",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  welcomeTo: {
    color: "#fff",
    fontSize: 20,
    opacity: 0.9,
    marginBottom: 10,
    letterSpacing: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  logo: {
    width: 208,
    height: 193,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  logoText: {
    fontSize: 40,
    color: "white",
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1.5, height: 5 },
    textShadowRadius: 1,
    letterSpacing: 1,
    marginTop: -45,
  },

  underline: {
    width: 295,
    height: 4,
    backgroundColor: "#ffffff",
    borderRadius: 2,
    marginTop: -3,
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    opacity: 0.9,
    marginTop: 10,
    marginBottom: 100,
  },
  buttonContainer: { position: "absolute", bottom: 80 },
  getStartBtn: {
    backgroundColor: "#F7941D",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  getStartText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
