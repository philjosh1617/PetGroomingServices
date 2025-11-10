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
  Modal,
} from 'react-native';

type TimeSlot = {
  id: string;
  time: string;
  selected?: boolean;
};

type DayOption = {
  id: string;
  label: string;
  selected: boolean;
};

type NavItem = {
  id: string;
  label: string;
  active: boolean;
};

const AppointmentBooking = () => {
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('November 11, 2025');
  const [days, setDays] = useState<DayOption[]>([
    { id: '1', label: 'Monday', selected: false },
    { id: '2', label: 'Tuesday', selected: true },
    { id: '3', label: 'Wednesday', selected: false },
    { id: '4', label: 'Thursday', selected: false },
    { id: '5', label: 'Friday', selected: false },
  ]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', time: '8:00 AM - 10:00 AM', selected: false },
    { id: '2', time: '10:00 AM - 12:00 PM', selected: true },
    { id: '3', time: '1:30 PM - 3:30 PM', selected: false },
    { id: '4', time: '3:30 PM - 5:30 PM', selected: false },
  ]);

  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: false },
    { id: '2', label: 'Date', active: true },
    { id: '3', label: 'Payment', active: false },
    { id: '4', label: 'Status', active: false },
    { id: '5', label: 'Like', active: false }, // Added Like tab
  ]);

  const availableDates = [
    'November 11, 2025',
    'November 12, 2025',
    'November 13, 2025',
    'November 14, 2025',
    'November 15, 2025',
  ];

  const toggleDaySelection = (id: string) => {
    setDays(prevDays => 
      prevDays.map(day => 
        day.id === id ? { ...day, selected: !day.selected } : { ...day, selected: false }
      )
    );
  };

  const toggleTimeSelection = (id: string) => {
    setTimeSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === id ? { ...slot, selected: !slot.selected } : { ...slot, selected: false }
      )
    );
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setDateModalVisible(false);
  };

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
        {/* Date Section with Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity 
            style={styles.dateDropdown}
            onPress={() => setDateModalVisible(true)}
          >
            <Text style={styles.dateDropdownText}>{selectedDate}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Days in Horizontal Row */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Available Days</Text>
          <View style={styles.daysHorizontalContainer}>
            {days.map((day, index) => (
              <View key={day.id} style={styles.dayItemContainer}>
                <TouchableOpacity
                  style={[styles.dayButton, day.selected && styles.dayButtonSelected]}
                  onPress={() => toggleDaySelection(day.id)}
                >
                  <Text style={[styles.dayButtonText, day.selected && styles.dayButtonTextSelected]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
                {index < days.length - 1 && (
                  <Text style={styles.daySeparator}>|</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Time Slots Section */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Available Time Slots</Text>
          <View style={styles.timeSlotsContainer}>
            <TouchableOpacity 
              style={[styles.timeSlot, timeSlots[0].selected && styles.timeSlotSelected]}
              onPress={() => toggleTimeSelection('1')}
            >
              <Text style={[styles.timeSlotText, timeSlots[0].selected && styles.timeSlotTextSelected]}>
                8:00 AM - 10:00 AM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timeSlot, timeSlots[1].selected && styles.timeSlotSelected]}
              onPress={() => toggleTimeSelection('2')}
            >
              <Text style={[styles.timeSlotText, timeSlots[1].selected && styles.timeSlotTextSelected]}>
                10:00 AM - 12:00 PM
              </Text>
            </TouchableOpacity>
            
            
            <TouchableOpacity 
              style={[styles.timeSlot, timeSlots[2].selected && styles.timeSlotSelected]}
              onPress={() => toggleTimeSelection('3')}
            >
              <Text style={[styles.timeSlotText, timeSlots[2].selected && styles.timeSlotTextSelected]}>
                1:30 PM - 3:30 PM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timeSlot, timeSlots[3].selected && styles.timeSlotSelected]}
              onPress={() => toggleTimeSelection('4')}
            >
              <Text style={[styles.timeSlotText, timeSlots[3].selected && styles.timeSlotTextSelected]}>
                3:30 PM - 5:30 PM
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.section}>
          <Text style={styles.infoText}>
            "Appointments can be rescheduled up to 24 hours in advance."
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/payment")}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Selection Modal */}
      <Modal
        visible={isDateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>
            {availableDates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateOption,
                  date === selectedDate && styles.dateOptionSelected
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={[
                  styles.dateOptionText,
                  date === selectedDate && styles.dateOptionTextSelected
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
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
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  dateDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  dateDropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  daysHorizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  dayItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  dayButtonSelected: {
    backgroundColor: '#DB6309',
    borderColor: '#000000ff',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#000000ff',
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  daySeparator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 8,
    fontWeight: '300',
  },
  timeSlotsContainer: {
    gap: 8,
  },
  timeSlot: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  timeSlotSelected: {
    backgroundColor: '#DB6309',
    borderColor: '#000000ff',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#000000ff',
    textAlign: 'center',
  },
  timeSlotTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: '#DB6309',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  dateOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateOptionSelected: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  dateOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  dateOptionTextSelected: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default AppointmentBooking;