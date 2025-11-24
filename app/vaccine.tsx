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
import { Ionicons } from '@expo/vector-icons'; // Added icon import

const VaccineScreen = () => {
  const [expiryDate, setExpiryDate] = useState('');

  const handleBackPress = () => {
    router.push('/food&medical'); // Navigate to food&medical screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
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
          
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Vaccine</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Confirmation</Text>
          </TouchableOpacity>
        </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* RABIES VACCINATION Section */}
        <View style={styles.vaccineSection}>
          <Text style={styles.vaccineTitle}>RABIES VACCINATION</Text>
          
          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>Expiry Date(MM/YY)</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="MM/YY"
              value={expiryDate}
              onChangeText={setExpiryDate}
              maxLength={5}
            />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => router.push("/confirmation")}
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
  // Main Header with Back Button
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#143470",
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 10,
    padding: 8,
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
    marginLeft: -24, // Compensate for back button space
  },
  // Vaccine Section
  vaccineSection: {
    paddingHorizontal: 20,
    marginTop: 40,
    alignItems: 'center',
  },
  vaccineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  dateSection: {
    width: '100%',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    width: '80%',
    textAlign: 'center',
  },
  // Next Button
  nextButton: {
    backgroundColor: '#DB6309',
    marginHorizontal: 20,
    marginTop: 50,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VaccineScreen;