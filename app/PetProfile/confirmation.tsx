import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePetContext } from '../contexts/PetContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.100.19:3000/api/pets';

const PetProfileSummaryScreen = () => {
  const { petData, resetPetData } = usePetContext();
  const [loading, setLoading] = useState(false);

  const renderRow = (label: string, value?: string | null) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );

  const handleSave = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You must be logged in');
        setLoading(false);
        return;
      }

      console.log('📝 Starting to save pet profile...');
      console.log('Pet data:', petData);

      const formData = new FormData();

      // Add text fields
      formData.append('name', petData.name);
      formData.append('breed', petData.breed);
      formData.append('age', petData.age);
      formData.append('gender', petData.gender ?? '');
      formData.append('size', petData.size ?? '');
      formData.append('medicalCondition', petData.medicalCondition || '');
      formData.append('behavioralConcern', petData.behavioralConcern || '');
      formData.append('treat', petData.treat || '');
      formData.append('rabiesExpiry', petData.rabiesExpiry || '');

      // ✅ Fix image upload for React Native
      if (petData.profileImage) {
        // Get the file extension from the URI
        const uriParts = petData.profileImage.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('profileImage', {
          uri: petData.profileImage,
          name: `pet.${fileType}`, // Use actual file type
          type: `image/${fileType}`, // Match the actual file type
        } as any);

        console.log('📷 Image added to FormData:', {
          uri: petData.profileImage,
          name: `pet.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      console.log('📤 Sending request to:', API_URL);

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000, // 15 second timeout
      });

      console.log('✅ Pet saved successfully:', response.data);

      resetPetData();

      Alert.alert('Success', 'Pet profile created successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/home'),
        },
      ]);
    } catch (error: any) {
      console.error('❌ Save error:', error);
      
      if (error.response) {
        // Server responded with error
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        Alert.alert('Error', error.response.data?.message || 'Failed to save pet profile');
      } else if (error.request) {
        // Request made but no response
        console.error('No response received:', error.request);
        Alert.alert('Error', 'No response from server. Please check your connection.');
      } else {
        // Something else happened
        console.error('Error message:', error.message);
        Alert.alert('Error', 'Failed to save pet profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Pet Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tab}>
          <Text style={styles.tabText}>About Pet</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>Food & Medical</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>Vaccine</Text>
        </View>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Confirmation</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileImageSection}>
          <View style={styles.profileImage}>
            {petData.profileImage ? (
              <Image 
                source={{ uri: petData.profileImage }} 
                style={{ width: 120, height: 120, borderRadius: 60 }}
                onError={(error) => {
                  console.log('❌ Image display error:', error.nativeEvent.error);
                }}
              />
            ) : (
              <Ionicons name="paw" size={40} color="#ccc" />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT PET</Text>
          {renderRow('Name', petData.name)}
          {renderRow('Breed', petData.breed)}
          {renderRow('Age', petData.age)}
          {renderRow('Gender', petData.gender)}
          {renderRow('Size', petData.size)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FOOD & MEDICAL</Text>
          {renderRow('Medical Condition', petData.medicalCondition)}
          {renderRow('Behavioral Concern', petData.behavioralConcern)}
          {renderRow('Treat', petData.treat || 'Not specified')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VACCINE</Text>
          {renderRow('Rabies Expiry Date', petData.rabiesExpiry)}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>CONFIRM & SAVE</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetProfileSummaryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#143470',
  },
  pageTitle: {
    fontSize: 26,
    color: '#fff',
    fontFamily: 'LuckiestGuy_400Regular',
    letterSpacing: 1,
  },
  tabContainer: { flexDirection: 'row', backgroundColor: '#eee', paddingVertical: 12 },
  tab: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 12, color: '#333' },
  activeTab: {
    backgroundColor: '#DB6309',
    borderRadius: 6,
    marginHorizontal: 4,
    paddingVertical: 6,
  },
  activeTabText: { color: '#fff', fontWeight: '600' },
  scrollContent: { paddingBottom: 40 },
  profileImageSection: { alignItems: 'center', paddingVertical: 30 },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  section: { paddingHorizontal: 20, marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 4 },
  value: {
    fontSize: 14,
    color: '#000',
    backgroundColor: '#f6f6f6',
    padding: 12,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#DB6309',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});