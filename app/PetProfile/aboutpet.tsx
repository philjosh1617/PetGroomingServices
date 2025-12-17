import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { usePetContext } from '../contexts/PetContext';

type PetSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'XLARGE';
type PetGender = 'BOY' | 'GIRL';

const PetProfileScreen = () => {
  const { petData, updatePetData } = usePetContext();

  const [name, setName] = useState(petData.name);
  const [breed, setBreed] = useState(petData.breed);
  const [age, setAge] = useState(petData.age);
  const [selectedGender, setSelectedGender] = useState<PetGender | null>(petData.gender);
  const [selectedSize, setSelectedSize] = useState<PetSize | null>(petData.size);
  const [imageUri, setImageUri] = useState<string | null>(petData.profileImage || null);

  const isFormComplete =
    name.trim() !== '' &&
    breed.trim() !== '' &&
    age.trim() !== '' &&
    selectedGender !== null &&
    selectedSize !== null;

  const sizes = [
    { size: 'SMALL', kg: '<15kg' },
    { size: 'MEDIUM', kg: '15-25kg' },
    { size: 'LARGE', kg: '25-35kg' },
    { size: 'XLARGE', kg: '>35kg' },
  ];

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos to upload pet images.');
        return;
      }

      // ✅ Launch image picker with updated API
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // ✅ Updated: Use array instead of MediaTypeOptions
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        console.log('Selected image URI:', uri);
        setImageUri(uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleNext = () => {
    // Save data to context (including image)
    updatePetData({
      name,
      breed,
      age,
      gender: selectedGender,
      size: selectedSize,
      profileImage: imageUri || undefined,
    });
    
    console.log('✅ Pet data updated, navigating to food&medical');
    router.push('/PetProfile/food&medical');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Pet Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>About Pet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Food & Medical</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Vaccine</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Confirmation</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Profile Image */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.profileImageContainer}>
              {imageUri ? (
                <Image 
                  source={{ uri: imageUri }} 
                  style={styles.profileImage}
                  onError={(error) => {
                    console.log('Image display error:', error.nativeEvent.error);
                  }}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="camera" size={40} color="#999" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.tapToChange}>TAP TO {imageUri ? 'CHANGE' : 'ADD PHOTO'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>NAME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>BREED</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter breed"
              value={breed}
              onChangeText={setBreed}
            />
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>AGE</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter age"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>GENDER</Text>
            <View style={styles.genderContainer}>
              {['BOY', 'GIRL'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderButton,
                    selectedGender === g && styles.genderButtonSelected,
                  ]}
                  onPress={() => setSelectedGender(g as PetGender)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedGender === g && styles.genderTextSelected,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>SIZE</Text>
            <View style={styles.sizeContainer}>
              {sizes.map((item) => (
                <TouchableOpacity
                  key={item.size}
                  style={[
                    styles.sizeButton,
                    selectedSize === item.size && styles.sizeButtonSelected,
                  ]}
                  onPress={() => setSelectedSize(item.size as PetSize)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === item.size && styles.sizeTextSelected,
                    ]}
                  >
                    {item.size}
                  </Text>
                  <Text
                    style={[
                      styles.sizePrice,
                      selectedSize === item.size && styles.sizePriceSelected,
                    ]}
                  >
                    {item.kg}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !isFormComplete && { opacity: 0.5 }]}
          disabled={!isFormComplete}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetProfileScreen;

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
    fontSize: 28,
    color: '#fff',
    fontFamily: 'LuckiestGuy_400Regular',
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    backgroundColor: 'lightgray',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: { backgroundColor: '#DB6309' },
  tabText: { fontSize: 12, color: '#000' },
  activeTabText: { color: '#fff' },
  profileSection: { alignItems: 'center', paddingVertical: 30 },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapToChange: { 
    fontSize: 12, 
    color: '#4A90E2', 
    marginTop: 6,
    fontWeight: '600',
  },
  infoSection: { paddingHorizontal: 20 },
  infoItem: { marginBottom: 25 },
  infoLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#000',
  },
  genderContainer: { flexDirection: 'row' },
  genderButton: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  genderButtonSelected: { backgroundColor: '#a4a4a7ff' },
  genderText: { fontSize: 16 },
  genderTextSelected: { fontWeight: '600' },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sizeButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  sizeButtonSelected: { backgroundColor: '#a4a4a7ff' },
  sizeText: { fontSize: 14 },
  sizeTextSelected: { fontWeight: '600' },
  sizePrice: { fontSize: 12 },
  sizePriceSelected: { fontWeight: '600' },
  nextButton: {
    backgroundColor: '#DB6309',
    margin: 20,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 20, fontWeight: '600' },
});