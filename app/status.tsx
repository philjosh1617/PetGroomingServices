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

type Appointment = {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  details?: string[];
};

const StatusScreen = () => {
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: false },
    { id: '2', label: 'Date', active: false },
    { id: '3', label: 'Payment', active: false },
    { id: '4', label: 'Status', active: true },
    { id: '5', label: 'Like', active: false },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      service: 'Nail Trimming',
      date: 'Nov 11, 2025',
      time: '1:30 PM',
      status: 'Pending',
      details: ['Flea Treatment']
    },
    {
      id: '2',
      service: 'Full Grooming',
      date: 'Nov 11, 2025',
      time: '1:30 PM',
      status: 'Pending',
    },
  ]);

  const handleNavPress = (id: string) => {
    setNavigationItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        active: item.id === id
      }))
    );
  };

  const handlePendingPress = () => {
    // Just make it clickable without any alert
    console.log('Pending button clicked');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#FFA500';
      case 'Confirmed':
        return '#007AFF';
      case 'Completed':
        return '#34C759';
      case 'Cancelled':
        return '#FF3B30';
      default:
        return '#666';
    }
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
        {/* Appointments List */}
        <View style={styles.appointmentsContainer}>
          {appointments.map((appointment, index) => (
            <View key={appointment.id}>
              <View style={styles.appointmentCard}>
                {/* Service */}
                <Text style={styles.serviceText}>
                  Service: {appointment.service}
                </Text>
                
                {/* Additional Details */}
                {appointment.details && appointment.details.map((detail, detailIndex) => (
                  <Text key={detailIndex} style={styles.detailText}>
                    {detail}
                  </Text>
                ))}
                
                {/* Date and Time */}
                <Text style={styles.dateText}>
                  Date: {appointment.date} / {appointment.time}
                </Text>
                
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                  <Text style={styles.statusBadgeText}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
              
              {/* Divider between appointments */}
              {index < appointments.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* Overall Status Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Appointment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Appointments:</Text>
              <Text style={styles.summaryValue}>{appointments.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pending:</Text>
              <Text style={[styles.summaryValue, { color: '#FFA500' }]}>
                {appointments.filter(a => a.status === 'Pending').length}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Next Appointment:</Text>
              <Text style={styles.summaryValue}>Nov 11, 2025 / 1:30 PM</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* PENDING Button at the bottom */}
      <TouchableOpacity 
        style={styles.pendingButton}
        onPress={() => router.push("/like")}
        activeOpacity={0.7}
      >
        <Text style={styles.pendingButtonText}>PENDING</Text>
      </TouchableOpacity>
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
    paddingBottom: 80, // Add padding to avoid overlap with bottom button
  },
  appointmentsContainer: {
    marginBottom: 25,
  },
  appointmentCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  serviceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    marginLeft: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  summarySection: {
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  pendingButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFA500',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pendingButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default StatusScreen;