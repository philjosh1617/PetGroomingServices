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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VaccineScreen = () => {
  const [expiryDate, setExpiryDate] = useState('');
  const [noRabies, setNoRabies] = useState(false);

  // Form validation: enable NEXT if expiryDate is filled OR No Rabies is selected
  const isFormComplete = expiryDate.trim() !== '' || noRabies;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/PetProfile/food&medical')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Pet Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Tab Navigation */}
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
        {/* Rabies Vaccination Section */}
        <View style={styles.vaccineSection}>
          <Text style={styles.vaccineTitle}>RABIES VACCINATION</Text>

          {/* No Rabies Option */}
          <TouchableOpacity
            style={[styles.noRabiesButton, noRabies && styles.noRabiesButtonSelected]}
            onPress={() => setNoRabies(!noRabies)}
          >
            <Text style={[styles.noRabiesText, noRabies && styles.noRabiesTextSelected]}>
              No Rabies Vaccination
            </Text>
          </TouchableOpacity>

          {/* Expiry Date input */}
          {!noRabies && (
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>Expiry Date (MM/YY)</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={setExpiryDate}
                maxLength={5}
              />
            </View>
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, !isFormComplete && styles.nextButtonDisabled]}
          disabled={!isFormComplete}
          onPress={() => router.push("/PetProfile/confirmation")}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },

  tabContainer: { flexDirection: 'row', paddingVertical: 15, backgroundColor: 'lightgray' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4, paddingVertical: 8, borderRadius: 6 },
  activeTab: { backgroundColor: '#DB6309' },
  tabText: { fontSize: 12, color: '#000' },
  activeTabText: { color: '#fff' },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingTop: 50, paddingBottom: 12, backgroundColor: "#143470" },
  pageTitle: { fontSize: 28, color: "#fff", fontFamily: "LuckiestGuy_400Regular", textShadowColor: "rgba(0,0,0,0.8)", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2, letterSpacing: 1 },

  vaccineSection: { paddingHorizontal: 20, marginTop: 40, alignItems: 'center' },
  vaccineTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  
  noRabiesButton: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, backgroundColor: '#f8f9fa', marginBottom: 20, width: '80%', alignItems: 'center' },
  noRabiesButtonSelected: { backgroundColor: '#a4a4a7ff', borderColor: '#797979ff' },
  noRabiesText: { color: '#000', fontSize: 16, fontWeight: '500' },
  noRabiesTextSelected: { color: '#fff', fontWeight: '600' },

  dateSection: { width: '100%', alignItems: 'center' },
  dateLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15 },
  dateInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, backgroundColor: '#f8f9fa', width: '80%', textAlign: 'center' },

  nextButton: { backgroundColor: '#DB6309', marginHorizontal: 20, marginTop: 50, borderRadius: 8, padding: 16, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  nextButtonDisabled: { opacity: 0.5 },
});

export default VaccineScreen;
