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
  TextInput,
} from 'react-native';

const PetProfileSummaryScreen = ({ navigation }: any) => {
  const [petData, setPetData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    medicalCondition: '',
    behavioralConcern: '',
    treat: '',
    rabiesVaccination: '',
    expiryDate: '',
  });

  const updateField = (field: string, value: string) => {
    setPetData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Pet Profile</Text>
        </View>

        {/* Tab Navigation Header */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>About Pet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Food & Medical</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Vaccine</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Confirmation</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profileImageSection}>
          <TouchableOpacity style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Pet Photo</Text>
              </View>
            </View>
            <Text style={styles.tapToChange}>TAP TO CHANGE</Text>
          </TouchableOpacity>
        </View>
        
        {/* Profile Information Section */}
        <View style={styles.profileSection}>
          {/* Name */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>NAME</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.name}
              onChangeText={(text) => updateField('name', text)}
            />
          </View>

          {/* Breed */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>BREED</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.breed}
              onChangeText={(text) => updateField('breed', text)}
            />
          </View>

          {/* Age */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>AGE</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.age}
              onChangeText={(text) => updateField('age', text)}
            />
          </View>

          {/* Gender */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>GENDER</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.gender}
              onChangeText={(text) => updateField('gender', text)}
            />
          </View>

          {/* Size */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>SIZE</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.size}
              onChangeText={(text) => updateField('size', text)}
            />
          </View>

          {/* Medical Condition */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>MEDICAL CONDITION</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.medicalCondition}
              onChangeText={(text) => updateField('medicalCondition', text)}
              multiline
            />
          </View>

          {/* Behavioral Concern */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>BEHAVIOURAL CONCERN</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.behavioralConcern}
              onChangeText={(text) => updateField('behavioralConcern', text)}
              multiline
            />
          </View>

          {/* Treat */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>TREAT</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.treat}
              onChangeText={(text) => updateField('treat', text)}
            />
          </View>
        </View>

        {/* Rabies Vaccination Section */}
        <View style={styles.vaccinationSection}>
          <Text style={styles.sectionTitle}>RABIES VACCINATION</Text>
          
          <View style={styles.inputRow}>
            <Text style={styles.label}>Expiry Date(MM/YYYY)</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={petData.expiryDate}
              onChangeText={(text) => updateField('expiryDate', text)}
            />
          </View>
        </View>

        {/* Save Button */}
         <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => router.push("/user")}
                  activeOpacity={0.7}
                >
          <Text style={styles.saveButtonText}>SAVE</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
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
    fontSize: 28,
    color: "#ffffffff",
    fontFamily: "LuckiestGuy",
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
  },
  // Profile Image Section
  profileImageSection: {
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
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  tapToChange: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  // Profile Information Section
  profileSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  vaccinationSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
  },
  saveButton: {
    backgroundColor: '#DB6309',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PetProfileSummaryScreen;