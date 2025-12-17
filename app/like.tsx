import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppointmentContext } from './contexts/AppointmentContext';

const ConfirmationScreen = () => {
  const { appointmentData } = useAppointmentContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>BOOKING CONFIRMED</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#34C759" />
          </View>
        </View>

        {/* Confirmation Header */}
        <View style={styles.confirmationHeader}>
          <Text style={styles.confirmationTitle}>Booking Confirmed! 🎉</Text>
        </View>

        {/* Confirmation Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Your booking has been received!</Text>
          <Text style={styles.messageText}>
            We can't wait to give your furry friend the care they deserve. Get ready for lots of cuddles, bubbles, and wagging tails!
          </Text>
          
          {/* Appointment Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Appointment Details:</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="paw" size={20} color="#143470" />
              <Text style={styles.detailText}>Pet: {appointmentData.petName || 'N/A'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color="#143470" />
              <Text style={styles.detailText}>
                Date: {appointmentData.appointmentDate || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color="#143470" />
              <Text style={styles.detailText}>
                Time: {appointmentData.appointmentTime || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash" size={20} color="#143470" />
              <Text style={styles.detailText}>
                Total: ₱{appointmentData.totalAmount || 0}
              </Text>
            </View>
          </View>

          {/* Status Info */}
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>📋 Current Status: PENDING</Text>
            <Text style={styles.statusText}>
              Your appointment is waiting for admin approval. You'll receive a notification once it's confirmed!
            </Text>
          </View>

          {/* Additional Information */}
          <Text style={styles.additionalText}>
            If you need to make any changes, don't worry — you can easily view your bookings in the Appointments tab. Until then, give your furry pal some extra love — they've got a pampering day ahead! 🐾
          </Text>

          {/* Thank You Message */}
          <Text style={styles.thankYouText}>
            Thank you for choosing HappyPaws Pet Grooming Services!
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Return to Dashboard Button */}
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.dashboardButtonText}>RETURN TO HOME</Text>
        </TouchableOpacity>

        {/* View Appointments Button */}
        <TouchableOpacity 
          style={styles.appointmentsButton}
          onPress={() => router.replace("/(tabs)/appointment")}
        >
          <Text style={styles.appointmentsButtonText}>VIEW MY APPOINTMENTS</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#143470",
  },
  pageTitle: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
    textAlign: 'center',
  },
  scrollContent: { padding: 20, paddingTop: 10 },
  successIconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#f8f8f8',
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 25,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 26,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#143470',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  statusInfo: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFA500',
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  additionalText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 21,
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  thankYouText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  dashboardButton: {
    backgroundColor: '#DB6309',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  appointmentsButton: {
    backgroundColor: '#143470',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  appointmentsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ConfirmationScreen;