import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppointmentContext } from './contexts/AppointmentContext';

const API_URL = 'http://192.168.100.19:3000/api/appointments';

type NavItem = { id: string; label: string; active: boolean };

const StatusScreen = () => {
  const { appointmentData, resetAppointmentData } = useAppointmentContext();
  
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: false },
    { id: '2', label: 'Date', active: false },
    { id: '3', label: 'Payment', active: false },
    { id: '4', label: 'Status', active: true },
    { id: '5', label: 'Like', active: false },
  ]);

  const [loading, setLoading] = useState(false);
  const [appointmentCreated, setAppointmentCreated] = useState(false);

  const handleNavPress = (id: string) => {
    setNavigationItems(prevItems =>
      prevItems.map(item => ({ ...item, active: item.id === id }))
    );
  };

  const handlePending = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You must be logged in');
        setLoading(false);
        return;
      }

      console.log('📝 Creating appointment with data:', appointmentData);

      // Validate appointment data
      if (!appointmentData.petId || 
          !appointmentData.services || 
          appointmentData.services.length === 0 ||
          !appointmentData.appointmentDate || 
          !appointmentData.appointmentTime || 
          !appointmentData.totalAmount || 
          !appointmentData.paymentMethod) {
        Alert.alert('Incomplete Booking', 'Please complete all booking steps before submitting.');
        setLoading(false);
        return;
      }

      // Create appointment
      const response = await axios.post(
        API_URL,
        {
          petId: appointmentData.petId,
          services: appointmentData.services,
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.appointmentTime,
          totalAmount: appointmentData.totalAmount,
          paymentMethod: appointmentData.paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      console.log('✅ Appointment created successfully:', response.data);
      setAppointmentCreated(true);

      // Reset appointment context
      resetAppointmentData();

      // Navigate to confirmation
      router.push("/like");

    } catch (error: any) {
      console.error('❌ Create appointment error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        Alert.alert('Booking Failed', error.response.data?.message || 'Failed to create appointment');
      } else if (error.request) {
        Alert.alert('Network Error', 'No response from server. Please check your connection.');
      } else {
        Alert.alert('Error', 'Failed to create appointment');
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
        <Text style={styles.pageTitle}>Book Appointment</Text>
        <View style={{ width: 1 }} />
      </View>

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
        {/* Booking Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pet:</Text>
              <Text style={styles.summaryValue}>{appointmentData.petName || 'N/A'}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Services:</Text>
              <View style={styles.servicesColumn}>
                {appointmentData.services && appointmentData.services.length > 0 ? (
                  appointmentData.services.map((service, index) => (
                    <Text key={index} style={styles.summaryValue}>
                      • {service.serviceName} (₱{service.price})
                    </Text>
                  ))
                ) : (
                  <Text style={styles.summaryValue}>No services selected</Text>
                )}
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>
                {appointmentData.appointmentDate || 'Not selected'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>
                {appointmentData.appointmentTime || 'Not selected'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method:</Text>
              <Text style={styles.summaryValue}>
                {appointmentData.paymentMethod === 'CREDIT_CARD' ? 'Credit Card' : 'Over the Counter'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₱{appointmentData.totalAmount || 0}</Text>
            </View>
          </View>
        </View>

        {/* Status Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>📋 What happens next?</Text>
          <Text style={styles.infoText}>
            Once you confirm your booking, your appointment will be marked as "Pending" 
            and sent to our admin for approval.
          </Text>
          <Text style={styles.infoText}>
            You'll receive a notification once your appointment is approved!
          </Text>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity 
        style={[styles.pendingButton, loading && styles.pendingButtonDisabled]}
        onPress={handlePending}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.pendingButtonText}>CONFIRM BOOKING</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navItem: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  navItemActive: { borderBottomWidth: 2, borderBottomColor: '#DB6309' },
  navText: { fontSize: 14, color: '#000000ff', fontWeight: '500' },
  navTextActive: { color: '#DB6309', fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingTop: 10, paddingBottom: 100 },
  summarySection: { marginBottom: 25 },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 16, color: '#666', fontWeight: '500', flex: 1 },
  summaryValue: { fontSize: 16, color: '#333', fontWeight: 'bold', flex: 1, textAlign: 'right' },
  servicesColumn: { flex: 1, alignItems: 'flex-end' },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 15 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#DB6309' },
  infoSection: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  pendingButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#DB6309',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pendingButtonDisabled: { opacity: 0.6 },
  pendingButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default StatusScreen;