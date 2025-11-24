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

const MedicalConditionScreen = ({ navigation }: any) => {
  const [hasMedicalCondition, setHasMedicalCondition] = useState<boolean | null>(null);
  const [hasBehavioralConcerns, setHasBehavioralConcerns] = useState<boolean | null>(null);
  const [medicalExplanation, setMedicalExplanation] = useState('');
  const [behavioralExplanation, setBehavioralExplanation] = useState('');
  const [preferredTreat, setPreferredTreat] = useState('');

  const handleBackPress = () => {
    router.push('/aboutpet'); // Navigate to aboutpet screen
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
        {/* Medical Condition Section - Lowered by reducing marginTop */}
        <View style={[styles.section, styles.medicalSection]}>
          <Text style={styles.sectionTitle}>MEDICAL CONDITION?</Text>
          <View style={styles.yesNoContainer}>
            <TouchableOpacity
              style={[
                styles.yesNoButton,
                hasMedicalCondition === true && styles.yesNoButtonSelected,
              ]}
              onPress={() => setHasMedicalCondition(true)}>
              <Text
                style={[
                  styles.yesNoText,
                  hasMedicalCondition === true && styles.yesNoTextSelected,
                ]}>
                YES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.yesNoButton,
                hasMedicalCondition === false && styles.yesNoButtonSelected,
              ]}
              onPress={() => setHasMedicalCondition(false)}>
              <Text
                style={[
                  styles.yesNoText,
                  hasMedicalCondition === false && styles.yesNoTextSelected,
                ]}>
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

        {/* Behavioral Concerns Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BEHAVIOURAL CONCERNS?</Text>
          <View style={styles.yesNoContainer}>
            <TouchableOpacity
              style={[
                styles.yesNoButton,
                hasBehavioralConcerns === true && styles.yesNoButtonSelected,
              ]}
              onPress={() => setHasBehavioralConcerns(true)}>
              <Text
                style={[
                  styles.yesNoText,
                  hasBehavioralConcerns === true && styles.yesNoTextSelected,
                ]}>
                YES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.yesNoButton,
                hasBehavioralConcerns === false && styles.yesNoButtonSelected,
              ]}
              onPress={() => setHasBehavioralConcerns(false)}>
              <Text
                style={[
                  styles.yesNoText,
                  hasBehavioralConcerns === false && styles.yesNoTextSelected,
                ]}>
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

        {/* Preferred Treat Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Treat (Optional)</Text>
          <TextInput
            style={styles.treatInput}
            placeholder="Enter preferred treat..."
            value={preferredTreat}
            onChangeText={setPreferredTreat}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => router.push("/vaccine")}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'lightgray',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  // Specific style for medical section to lower it
  medicalSection: {
    marginTop: 10, // Reduced from default to lower the section
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15, // Reduced from 30 to lower the content
  },
  yesNoContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  yesNoButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  yesNoButtonSelected: {
    borderColor: '#A9A9A9',
    backgroundColor: '#A9A9A9',
  },
  yesNoText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  yesNoTextSelected: {
    color: '#000000ff',
    fontWeight: '600',
  },
  explanationContainer: {
    marginTop: 10,
  },
  explanationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
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
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MedicalConditionScreen;