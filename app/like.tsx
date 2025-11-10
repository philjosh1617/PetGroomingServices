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
} from 'react-native';

type NavItem = {
  id: string;
  label: string;
  active: boolean;
};

const ConfirmationScreen = () => {
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: false },
    { id: '2', label: 'Date', active: false },
    { id: '3', label: 'Payment', active: false },
    { id: '4', label: 'Status', active: false },
    { id: '5', label: 'Like', active: false },
  ]);

  const handleNavPress = (id: string) => {
    setNavigationItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        active: item.id === id
      }))
    );
  };

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
        {/* Confirmation Header */}
        <View style={styles.confirmationHeader}>
          <Text style={styles.confirmationTitle}>Booking confirmed !</Text>
        </View>

        {/* Confirmation Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Your booking is confirmed!</Text>
          <Text style={styles.messageText}>
            We can't wait to give your furry friend the care they deserve. Get ready for lots of cuddles, bubbles, and wagging tails!
          </Text>
          
          {/* Appointment Date */}
          <View style={styles.appointmentDate}>
            <Text style={styles.dateText}>
              See you on November 11, 2025, at 1:30 PM!
            </Text>
          </View>

          {/* Additional Information */}
          <Text style={styles.additionalText}>
            If you need to make any changes, don't worry — you can easily reschedule through your bookings page. Until then, give your furry pal some extra love — they've got a pampering day ahead! *.*
          </Text>

          {/* Thank You Message */}
          <Text style={styles.thankYouText}>
            Thank you for choosing us to be part of your pet's grooming journey.
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Return to Dashboard Button */}
        <TouchableOpacity style={styles.dashboardButton}onPress={() => router.push("/home")}>
          <Text style={styles.dashboardButtonText}>RETURN TO DASHBOARD</Text>
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
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34C759',
    textAlign: 'center',
    textShadowColor: 'rgba(52, 199, 89, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
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
  appointmentDate: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#34C759',
    marginBottom: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    textAlign: 'center',
    lineHeight: 22,
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
    marginTop: 10,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ConfirmationScreen;