import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PetProfileSummaryScreen = () => {
  /**
   * Expecting petData to be passed from previous steps
   * Example:
   * router.push({
   *   pathname: '/PetProfile/confirmation',
   *   params: { petData: JSON.stringify(petData) }
   * })
   */
  const params = useLocalSearchParams();
  const petData = params.petData
    ? JSON.parse(params.petData as string)
    : {};

  const renderRow = (label: string, value?: string) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Pet Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tab}><Text style={styles.tabText}>About Pet</Text></View>
        <View style={styles.tab}><Text style={styles.tabText}>Food & Medical</Text></View>
        <View style={styles.tab}><Text style={styles.tabText}>Vaccine</Text></View>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Confirmation</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImage}>
            <Text style={styles.placeholderText}>Pet Photo</Text>
          </View>
        </View>

        {/* About Pet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT PET</Text>
          {renderRow('Name', petData.name)}
          {renderRow('Breed', petData.breed)}
          {renderRow('Age', petData.age)}
          {renderRow('Gender', petData.gender)}
          {renderRow('Size', petData.size)}
        </View>

        {/* Medical */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FOOD & MEDICAL</Text>
          {renderRow('Medical Condition', petData.medicalCondition)}
          {renderRow('Behavioral Concern', petData.behavioralConcern)}
          {renderRow('Treat', petData.treat)}
        </View>

        {/* Vaccine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VACCINE</Text>
          {renderRow('Rabies Expiry Date', petData.expiryDate)}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={() => {
            // Later: submit to backend here
            console.log('Final Pet Data:', petData);
            router.replace('/user');
          }}
        >
          <Text style={styles.saveButtonText}>CONFIRM & SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetProfileSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

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

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 12,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
  },

  tabText: {
    fontSize: 12,
    color: '#333',
  },

  activeTab: {
    backgroundColor: '#DB6309',
    borderRadius: 6,
    marginHorizontal: 4,
    paddingVertical: 6,
  },

  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#666',
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },

  row: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },

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

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
