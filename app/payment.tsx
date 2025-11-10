import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';

type NavItem = {
  id: string;
  label: string;
  active: boolean;
};

type PaymentMethod = {
  id: string;
  label: string;
  selected: boolean;
};

const PaymentScreen = () => {
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: false },
    { id: '2', label: 'Date', active: false },
    { id: '3', label: 'Payment', active: true },
    { id: '4', label: 'Status', active: false },
    { id: '5', label: 'Like', active: false },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', label: 'CREDIT CARD', selected: true },
    { id: '2', label: 'OVER THE COUNTER', selected: false },
  ]);

  const [cardInfo, setCardInfo] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [saveCard, setSaveCard] = useState(false);

  const handleNavPress = (id: string) => {
    setNavigationItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        active: item.id === id
      }))
    );
  };

  const handlePaymentMethodSelect = (id: string) => {
    setPaymentMethods(prevMethods =>
      prevMethods.map(method => ({
        ...method,
        selected: method.id === id
      }))
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setCardInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isCreditCardSelected = paymentMethods[0].selected;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>BOOK APPOINTMENT</Text>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.navItem, item.active && styles.navItemActive]}
            onPress={() => handleNavPress(item.id)}
          >
            <Text style={[styles.navText, item.active && styles.navTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  method.selected && styles.paymentMethodSelected
                ]}
                onPress={() => handlePaymentMethodSelect(method.id)}
              >
                <Text style={[
                  styles.paymentMethodText,
                  method.selected && styles.paymentMethodTextSelected
                ]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dynamic Content Based on Payment Method */}
        {isCreditCardSelected ? (
          /* Credit Card Information Section */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Information</Text>
            
            {/* Cardholder Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CARDHOLDER NAME</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Name"
                placeholderTextColor="#999"
                value={cardInfo.cardholderName}
                onChangeText={(text) => handleInputChange('cardholderName', text)}
              />
            </View>

            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CARD NUMBER</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Card Number"
                placeholderTextColor="#999"
                value={cardInfo.cardNumber}
                onChangeText={(text) => handleInputChange('cardNumber', text)}
                keyboardType="numeric"
              />
            </View>

            {/* Expiry Date and CVV */}
            <View style={styles.rowInputs}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.inputLabel}>MM/YY</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Date"
                  placeholderTextColor="#999"
                  value={cardInfo.expiryDate}
                  onChangeText={(text) => handleInputChange('expiryDate', text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInputGroup}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="CVV Digit"
                  placeholderTextColor="#999"
                  value={cardInfo.cvv}
                  onChangeText={(text) => handleInputChange('cvv', text)}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Save Card Option */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View style={[
                styles.checkbox,
                saveCard && styles.checkboxSelected
              ]}>
                {saveCard && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Save card (optional)</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxSubtext}>Save this card for future bookings</Text>
          </View>
        ) : (
          /* Over the Counter Information Section */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Over the Counter Payment</Text>
            <View style={styles.overTheCounterContainer}>
              <Text style={styles.overTheCounterTitle}>
                We know every fur parent has their own way to pay!
              </Text>
              <Text style={styles.overTheCounterText}>
                With Over the Counter, you can visit any partner outlet to complete your booking payment.
                Just present your booking details — and your pet's next pampering session is all set!
              </Text>
              
              {/* Additional Information */}
              <View style={styles.additionalInfo}>
                <Text style={styles.additionalInfoTitle}>How it works:</Text>
                <View style={styles.stepsContainer}>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>1</Text>
                    <Text style={styles.stepText}>Complete your booking online</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>2</Text>
                    <Text style={styles.stepText}>Visit any of our partner outlets</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>3</Text>
                    <Text style={styles.stepText}>Present your booking reference number</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>4</Text>
                    <Text style={styles.stepText}>Pay at the counter and you're all set!</Text>
                  </View>
                </View>
                
                <Text style={styles.noteText}>
                  You'll receive a booking confirmation with all the details and reference number after completing this step.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton}onPress={() => router.push("/status")}>
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
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navItem: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#DB6309',
  },
  navText: {
    fontSize: 14,
    color: '#000000ff',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#DB6309',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000ff',
    marginBottom: 20,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  paymentMethod: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  paymentMethodSelected: {
    backgroundColor: '#DB6309',
    borderColor: '#DB6309',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  paymentMethodTextSelected: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  halfInputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#333',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  checkboxSubtext: {
    fontSize: 14,
    color: '#666',
    marginLeft: 32,
    fontStyle: 'italic',
  },
  overTheCounterContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  overTheCounterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DB6309',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  overTheCounterText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  additionalInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  stepsContainer: {
    gap: 10,
    marginBottom: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#DB6309',
    color: '#fff',
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  nextButton: {
    backgroundColor: '#DB6309',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;