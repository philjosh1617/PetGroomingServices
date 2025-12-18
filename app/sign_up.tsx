import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFonts, LuckiestGuy_400Regular } from '@expo-google-fonts/luckiest-guy';

/* ================= CONFIG ================= */
const API_URL = 'http://192.168.100.19:3000/api/auth';

/* ================= COMPONENT ================= */
export default function SignUp() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    LuckiestGuy_400Regular,
  });

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  /* ================= SIGN UP HANDLER ================= */
  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (username.length < 4) {
      Alert.alert('Error', 'Username should be at least 4 characters long');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/register`,
        {
          username: username.trim(),
          email: email.toLowerCase().trim(),
          password,
        },
        { timeout: 10000 }
      );

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      // ✅ SUCCESS ALERT (waits for OK)
      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/home');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Server error. Please try again later.';

      Alert.alert('Signup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/pawpatterns.png')}
        style={styles.container}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardHeight + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}
          <View style={styles.logo_container}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: 200, height: 180 }}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>HAPPY PAWS</Text>
            <View style={[styles.underline, styles.underlineOutline]} />
            <View style={styles.underline} />
          </View>

          {/* USERNAME */}
          <View style={styles.inputContainer}>
            <Feather name="user" size={22} color="#4A5568" />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* EMAIL */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={22} color="#4A5568" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={22} color="#4A5568" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#4A5568"
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={22} color="#4A5568" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#4A5568"
              />
            </TouchableOpacity>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={[styles.signupButton, loading && styles.disabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* LOGIN LINK */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login">
              <Text style={styles.loginLink}> Log in</Text>
            </Link>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143470',
  },
  center: {
    flex: 1,
    backgroundColor: '#143470',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logo_container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'LuckiestGuy_400Regular',
    marginTop: -40,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 2,
  },
  underline: {
    width: '80%',
    height: 4,
    backgroundColor: '#fff',
    marginTop: -6,
    borderRadius: 2,
  },
  underlineOutline: {
    backgroundColor: '#000000aa',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#4269B4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: '#fff',
  },
  loginLink: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
