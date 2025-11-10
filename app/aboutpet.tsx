import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput, // Added TextInput import
} from 'react-native';

type PetSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'XLARGE';
type PetGender = 'BOY' | 'GIRL';

const PetProfileScreen = () => {
  const [selectedGender, setSelectedGender] = useState<PetGender>('BOY');
  const [selectedSize, setSelectedSize] = useState<PetSize>('MEDIUM');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');

  const sizes = [
    { size: 'SMALL', kg: '<15kg' },
    { size: 'MEDIUM', kg: '15-25kg' },
    { size: 'LARGE', kg: '25-35kg' },
    { size: 'XLARGE', kg: '>35kg' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
    
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Main Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Pet Profile</Text>
        </View>

        {/* Tab Navigation Header */}
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


        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
            </View>
            <Text style={styles.tapToChange}>TAP TO CHANGE</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Information Section */}
        <View style={styles.infoSection}>
          {/* Name */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter name"
                placeholderTextColor="#999"
                value={petName}
                onChangeText={setPetName}
                maxLength={50}
              />
            </View>
          </View>

          {/* Breed */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>BREED</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter breed"
                placeholderTextColor="#999"
                value={petBreed}
                onChangeText={setPetBreed}
                maxLength={50}
              />
            </View>
          </View>

          {/* Age */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>AGE</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter age"
                placeholderTextColor="#999"
                value={petAge}
                onChangeText={setPetAge}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          {/* Gender */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>GENDER</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGender === 'BOY' && styles.genderButtonSelected,
                ]}
                onPress={() => setSelectedGender('BOY')}>
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === 'BOY' && styles.genderTextSelected,
                  ]}>
                  BOY
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  selectedGender === 'GIRL' && styles.genderButtonSelected,
                ]}
                onPress={() => setSelectedGender('GIRL')}>
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === 'GIRL' && styles.genderTextSelected,
                  ]}>
                  GIRL
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Size with Prices */}
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
                  onPress={() => setSelectedSize(item.size as PetSize)}>
                  <View style={styles.sizeContent}>
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === item.size && styles.sizeTextSelected,
                      ]}>
                      {item.size}
                    </Text>
                    <Text
                      style={[
                        styles.sizePrice,
                        selectedSize === item.size && styles.sizePriceSelected,
                      ]}>
                      {item.kg}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => router.push("/food&medical")}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  // Tab Navigation Styles
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'lightgray',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffffff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#DB6309',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000ff',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Main Header
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
    fontSize: 35,
    color: "#ffffffff",
    fontFamily: "LuckiestGuy",
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 5, height: 7 },
    textShadowRadius: 1,
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
  },
  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photoItem: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileImageText: {
    color: '#666',
    fontSize: 14,
  },
  tapToChange: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  // Info Section
  infoSection: {
    paddingHorizontal: 20,
  },
  infoItem: {
    marginBottom: 25,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  textInput: {
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  // Gender Styles
  genderContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  genderButtonSelected: {
    borderColor: '#a4a4a7ff',
    backgroundColor: '#a4a4a7ff',
  },
  genderText: {
    fontSize: 16,
    color: '#000000ff',
    fontWeight: '500',
  },
  genderTextSelected: {
    color: '#000000ff',
    fontWeight: '600',
  },

  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeButton: {
    flex: 1,
    minWidth: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
  },
  sizeButtonSelected: {
    borderColor: '#797979ff',
    backgroundColor: '#a4a4a7ff',
  },
  sizeContent: {
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 14,
    color: '#000000ff',
    fontWeight: '500',
    marginBottom: 4,
  },
  sizeTextSelected: {
    color: '#000000ff',
    fontWeight: '600',
  },
  sizePrice: {
    fontSize: 12,
    color: '#000000ff',
    fontWeight: '500',
  },
  sizePriceSelected: {
    color: '#000000ff',
    fontWeight: '600',
  },
  // Next Button
  nextButton: {
    backgroundColor: '#DB6309',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default PetProfileScreen;