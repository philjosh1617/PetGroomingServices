import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppointmentContext } from './contexts/AppointmentContext';

/* =======================
   TYPES
======================= */
type TimeSlot = {
  id: string;
  time: string;
  selected?: boolean;
};

type NavItem = {
  id: string;
  label: string;
  active: boolean;
};

/* =======================
   DATE HELPERS
======================= */
const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

const getWeekday = (date: Date) =>
  date.toLocaleDateString('en-US', { weekday: 'long' });

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/* Generate next 7 days automatically */
const generateDates = (daysAhead = 30) => {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }

  return dates;
};

/* =======================
   COMPONENT
======================= */
const AppointmentBooking = () => {
  const { updateAppointmentData } = useAppointmentContext();

  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [availableDates] = useState<Date[]>(generateDates(30));
  const [selectedDate, setSelectedDate] = useState<Date>(availableDates[0]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', time: '8:00 AM - 10:00 AM' },
    { id: '2', time: '10:00 AM - 12:00 PM' },
    { id: '3', time: '1:30 PM - 3:30 PM' },
    { id: '4', time: '3:30 PM - 5:30 PM' },
  ]);

  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: false },
    { id: '2', label: 'Date', active: true },
    { id: '3', label: 'Payment', active: false },
    { id: '4', label: 'Status', active: false },
    { id: '5', label: 'Like', active: false },
  ]);

  /* =======================
     HANDLERS
  ======================= */
  const toggleTimeSelection = (id: string) => {
    if (isWeekend(selectedDate)) return;

    setTimeSlots(prev =>
      prev.map(slot =>
        slot.id === id
          ? { ...slot, selected: true }
          : { ...slot, selected: false }
      )
    );
  };

  const handleDateSelect = (date: Date) => {
    if (isWeekend(date)) {
      Alert.alert(
        'Unavailable Date',
        'Appointments are only available Monday to Friday.'
      );
      return;
    }

    setSelectedDate(date);
    setDateModalVisible(false);

    // Reset time selection when date changes
    setTimeSlots(prev =>
      prev.map(slot => ({ ...slot, selected: false }))
    );
  };

  const handleNext = () => {
    if (isWeekend(selectedDate)) {
      Alert.alert('Unavailable', 'No appointments on weekends.');
      return;
    }

    const selectedTime = timeSlots.find(slot => slot.selected);
    if (!selectedTime) {
      Alert.alert('No Time Selected', 'Please select a time slot.');
      return;
    }

    updateAppointmentData({
      appointmentDate: formatDate(selectedDate),
      appointmentDay: getWeekday(selectedDate),
      appointmentTime: selectedTime.time,
    });

    router.push('/payment');
  };

  /* =======================
     UI
  ======================= */
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Book Appointment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* DATE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>

          <TouchableOpacity
            style={styles.dateDropdown}
            onPress={() => setDateModalVisible(true)}
          >
            <Text style={styles.dateDropdownText}>
              {formatDate(selectedDate)}
            </Text>
            <Text>▼</Text>
          </TouchableOpacity>

          <Text style={styles.weekdayText}>
            Day: {getWeekday(selectedDate)}
          </Text>

          {isWeekend(selectedDate) && (
            <Text style={styles.weekendText}>Weekend not available</Text>
          )}
        </View>

        {/* TIME */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Available Time Slots</Text>

          {isWeekend(selectedDate) ? (
            <Text style={styles.disabledText}>
              Time selection disabled on weekends
            </Text>
          ) : (
            timeSlots.map(slot => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  slot.selected && styles.timeSlotSelected,
                ]}
                onPress={() => toggleTimeSelection(slot.id)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    slot.selected && styles.timeSlotTextSelected,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* DATE MODAL */}
      <Modal transparent visible={isDateModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Date</Text>

            <ScrollView style={{ maxHeight: 350 }}>
              {availableDates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dateOption}
                onPress={() => handleDateSelect(date)}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    isWeekend(date) && styles.disabledText,
                  ]}
                >
                  {formatDate(date)} ({getWeekday(date)})
                </Text>
              </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setDateModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 12,
    backgroundColor: '#143470',
  },

  pageTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },

  scrollContent: { padding: 20 },

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  sectionSubtitle: { fontSize: 16, fontWeight: '600' },

  dateDropdown: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dateDropdownText: { fontSize: 16 },

  weekdayText: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#555',
  },

  weekendText: { color: 'red', marginTop: 4 },

  timeSlot: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },

  timeSlotSelected: {
    backgroundColor: '#DB6309',
  },

  timeSlotText: { textAlign: 'center' },
  timeSlotTextSelected: { color: '#fff', fontWeight: 'bold' },

  disabledText: { color: '#999', fontStyle: 'italic' },

  nextButton: {
    backgroundColor: '#DB6309',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },

  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },

  dateOption: { padding: 12 },

  dateOptionText: { textAlign: 'center' },

  modalCloseButton: { marginTop: 10, alignItems: 'center' },

  modalCloseText: { color: '#666' },
});

export default AppointmentBooking;
