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
import { usePetContext } from '../contexts/PetContext';

const MedicalConditionScreen = () => {
  const { petData, updatePetData } = usePetContext();

  const [hasMedicalCondition, setHasMedicalCondition] = useState<boolean | null>(
    petData.medicalCondition ? true : null
  );
  const [hasBehavioralConcerns, setHasBehavioralConcerns] = useState<boolean | null>(
    petData.behavioralConcern ? true : null
  );
  const [medicalExplanation, setMedicalExplanation] = useState(petData.medicalCondition);
  const [behavioralExplanation, setBehavioralExplanation] = useState(petData.behavioralConcern);
  const [preferredTreat, setPreferredTreat] = useState(petData.treat);

  const isMedicalSectionValid =
    hasMedicalCondition !== null &&
    (hasMedicalCondition === false || medicalExplanation.trim() !== '');

  const isBehavioralSectionValid =
    hasBehavioralConcerns !== null &&
    (hasBehavioralConcerns === false || behavioralExplanation.trim() !== '');

  const isFormComplete = isMedicalSectionValid && isBehavioralSectionValid;

  const handleNext = () => {
    updatePetData({
      medicalCondition: hasMedicalCondition ? medicalExplanation : 'None',
      behavioralConcern: hasBehavioralConcerns ? behavioralExplanation : 'None',
      treat: preferredTreat,
    });
    router.push('/PetProfile/vaccine');
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
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>About Pet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Food & Medical</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Vaccine</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Confirmation</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, styles.medicalSection]}>
          <Text style={styles.sectionTitle}>MEDICAL CONDITION?</Text>
          <View style={styles.yesNoContainer}>
            <TouchableOpacity
              style={[
                styles.yesNoButton,
                hasMedicalCondition === true && styles.yesNoButtonSelected,
              ]}
              onPress={() => setHasMedicalCondition(true)}
            >
              <Text
                style={[
                  styles.yesNoText,
                  hasMedicalCondition === true && styles.yesNoTextSelected,
                ]}
              >
                YES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.yesNoButton,
                hasMedicalCondition === false && styles.yesNoButtonSelected,
              ]}
              onPress={() => setHasMedicalCondition(false)}
            >
              <Text
                style={[
                  styles.yesNoText,
                  hasMedicalCondition === false && styles.yesNoTextSelected,
                ]}
              >
                NO
              </Text>
            </TouchableOpacity>
          </View>

          {hasMedicalCondition && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationLabel}>[EXPLANATION OF CONDITION]</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                placeholder="Describe the medical condition..."
                value={medicalExplanation}
                onChangeText={setMedicalExplanation}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BEHAVIOURAL CONCERNS?</Text>
          <View style={styles.yesNoContainer}>
            <TouchableOpacity
              style={[
                styles.yesNoButton,
                hasBehavioralConcerns === true && styles.yesNoButtonSelected,
              ]}
              onPress={() => setHasBehavioralConcerns(true)}
            >
              <Text
                style={[
                  styles.yesNoText,
                  hasBehavioralConcerns === true && styles.yesNoTextSelected,
                ]}
              >
                YES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.yesNoButton,
                hasBehavioralConcerns === false && styles.yesNoButtonSelected,
              ]}
              onPress={() => setHasBehavioralConcerns(false)}
            >
              <Text
                style={[
                  styles.yesNoText,
                  hasBehavioralConcerns === false && styles.yesNoTextSelected,
                ]}
              >
                NO
              </Text>
            </TouchableOpacity>
          </View>

          {hasBehavioralConcerns && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationLabel}>Please Explain.</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                placeholder="Describe behavioral concerns..."
                value={behavioralExplanation}
                onChangeText={setBehavioralExplanation}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Treat (Optional)</Text>
          <TextInput
            style={styles.treatInput}
            placeholder="Enter preferred treat..."
            value={preferredTreat}
            onChangeText={setPreferredTreat}
          />
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !isFormComplete && styles.nextButtonDisabled]}
          disabled={!isFormComplete}
          onPress={handleNext}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#143470",
  },
  pageTitle: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  section: { paddingHorizontal: 20, marginBottom: 30 },
  medicalSection: { marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15 },
  yesNoContainer: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  yesNoButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  yesNoButtonSelected: { borderColor: '#A9A9A9', backgroundColor: '#A9A9A9' },
  yesNoText: { fontSize: 16, color: '#666', fontWeight: '500' },
  yesNoTextSelected: { color: '#000000ff', fontWeight: '600' },
  explanationContainer: { marginTop: 10 },
  explanationLabel: { fontSize: 14, color: '#666', marginBottom: 8, fontStyle: 'italic' },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: '#f8f9fa',
  },
  treatInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
  },
  nextButton: {
    backgroundColor: '#DB6309',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  nextButtonDisabled: { opacity: 0.5 },
});

export default MedicalConditionScreen;