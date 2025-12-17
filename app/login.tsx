import React, { useState, useEffect, useRef } from 'react';
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
export default function Login() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  /* ================= LOGIN HANDLER ================= */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: email.toLowerCase().trim(),
          password,
        },
        { timeout: 10000 }
      );

      const { token, user } = response.data;

      /* ================= ADMIN LOGIN ================= */
      if (user.isAdmin) {
        await AsyncStorage.setItem('adminToken', token);
        await AsyncStorage.setItem('adminUser', JSON.stringify(user));

        Alert.alert(
          'Admin Login',
          'Welcome Admin!',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/admin/dashboard');
              },
            },
          ],
          { cancelable: false }
        );

        return;
      }

      /* ================= NORMAL USER LOGIN ================= */
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert(
        'Success',
        'Login successful',
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
      if (error.response) {
        const message = error.response.data.message;

        if (message === 'Email not found') {
          Alert.alert('Login Failed', 'Email not found.');
        } else if (message === 'Incorrect password') {
          Alert.alert('Login Failed', 'Wrong password.');
        } else {
          Alert.alert('Login Failed', message);
        }
      } else {
        Alert.alert(
          'Network Error',
          'Cannot connect to server. Check your internet.'
        );
      }
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

          {/* EMAIL */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={22} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={22} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* FORGOT PASSWORD */}
          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* SIGN UP */}
          <View style={styles.footer}>
            <Text style={{ color: '#fff' }}>Don’t have an account?</Text>
            <Link href="/sign_up">
              <Text style={styles.signUp}> Sign Up</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo_container: {
    alignItems: 'center',
    marginBottom: 60,
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
    height: 50,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#4A90E2',
  },
  loginButton: {
    backgroundColor: '#4269B4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signUp: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
