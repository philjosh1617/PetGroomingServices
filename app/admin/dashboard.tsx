import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.100.19:3000/api/appointments';

type Appointment = {
  _id: string;
  userId: {
    username: string;
    email: string;
  };
  petId: {
    name: string;
    breed: string;
    profileImage: string;
  };
  services: { serviceName: string; price: number }[];
  appointmentDate: string;
  appointmentTime: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  adminNotes: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    checkAdminAuth();
    fetchAppointments();
  }, []);

  const checkAdminAuth = async () => {
    const token = await AsyncStorage.getItem('adminToken');
    const user = await AsyncStorage.getItem('adminUser');
    
    if (!token || !user) {
      Alert.alert('Unauthorized', 'Admin access required');
      router.replace('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (!userData.isAdmin) {
      Alert.alert('Access Denied', 'Admin privileges required');
      router.replace('/(tabs)/home');
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) return;

      setLoading(true);

      const response = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      console.log('✅ Admin fetched appointments:', response.data);
      setAppointments(response.data);
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error?.response?.data || error.message);
      if (error?.response?.status === 403) {
        Alert.alert('Access Denied', 'Admin privileges required');
        router.replace('../admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const handleStatusUpdate = async () => {
    if (!selectedAppointment || !newStatus) {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('adminToken');
      
      await axios.put(
        `${API_URL}/admin/${selectedAppointment._id}/status`,
        {
          status: newStatus,
          adminNotes: adminNotes || '',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Success', 'Appointment status updated');
      setModalVisible(false);
      fetchAppointments();
    } catch (error: any) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const openStatusModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setAdminNotes(appointment.adminNotes || '');
    setModalVisible(true);
  };

  const handleLogout = async () => {
    Alert.alert('Logout Options', 'Choose an option:', [
      { 
        text: 'Switch to Customer View', 
        onPress: () => router.replace('/(tabs)/home')
      },
      {
        text: 'Logout Completely',
        onPress: async () => {
          await AsyncStorage.removeItem('adminToken');
          await AsyncStorage.removeItem('adminUser');
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          router.replace('/login');
        },
        style: 'destructive'
      },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FFA500';
      case 'APPROVED': return '#2196F3';
      case 'IN_PROGRESS': return '#FF9800';
      case 'COMPLETED': return '#4CAF50';
      case 'CANCELLED': return '#F44336';
      case 'CLAIMED': return '#4CAF50';
      default: return '#666';
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    filterStatus === 'ALL' || apt.status === filterStatus
  );

  const statusCounts = {
    ALL: appointments.length,
    PENDING: appointments.filter(a => a.status === 'PENDING').length,
    APPROVED: appointments.filter(a => a.status === 'APPROVED').length,
    IN_PROGRESS: appointments.filter(a => a.status === 'IN_PROGRESS').length,
    COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage Appointments</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards - FIXED: Added fixed width and proper spacing */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.statsContainer}
        contentContainerStyle={styles.statsContentContainer}
      >
        {Object.entries(statusCounts).map(([status, count]) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statCard,
              filterStatus === status && styles.statCardActive
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={styles.statCount}>{count}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>
              {status.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Appointments List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#143470" />
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.appointmentCard}
              onPress={() => openStatusModal(item)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.petName}>🐾 {item.petId?.name || 'Unknown'}</Text>
                  <Text style={styles.ownerName}>{item.userId?.username || 'Unknown'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={16} color="#666" />
                  <Text style={styles.infoText}>{item.appointmentDate}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.infoText}>{item.appointmentTime}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="cut" size={16} color="#666" />
                  <Text style={styles.infoText} numberOfLines={1}>
                    {item.services.map(s => s.serviceName).join(', ')}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="cash" size={16} color="#666" />
                  <Text style={styles.infoText}>₱{item.totalAmount}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.tapToUpdate}>Tap to update status</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No appointments found</Text>
            </View>
          }
        />
      )}

      {/* Status Update Modal - FIXED: Added KeyboardAvoidingView and ScrollView */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <TouchableOpacity 
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={styles.modalContentWrapper}
            >
              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Update Appointment Status</Text>

                  {selectedAppointment && (
                    <View style={styles.modalInfo}>
                      <Text style={styles.modalInfoText}>
                        Pet: {selectedAppointment.petId?.name}
                      </Text>
                      <Text style={styles.modalInfoText}>
                        Owner: {selectedAppointment.userId?.username}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.label}>Select Status:</Text>
                  <View style={styles.statusButtons}>
                    {['PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CLAIMED', 'CANCELLED'].map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusButton,
                          newStatus === status && styles.statusButtonActive,
                          { borderColor: getStatusColor(status) }
                        ]}
                        onPress={() => setNewStatus(status)}
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            newStatus === status && { color: getStatusColor(status) }
                          ]}
                        >
                          {status.replace('_', ' ')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>Admin Notes (Optional):</Text>
                  <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={3}
                    placeholder="Add notes..."
                    value={adminNotes}
                    onChangeText={setAdminNotes}
                  />

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={handleStatusUpdate}
                    >
                      <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#143470',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.8, marginTop: 4 },
  logoutButton: { padding: 8 },
  
  // FIXED: Stats container with proper sizing
  statsContainer: { 
    paddingVertical: 15,
    flexGrow: 0,
  },
  statsContentContainer: {
    paddingHorizontal: 15,
    paddingRight: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    width: 100, // FIXED: Fixed width instead of minWidth
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    height: 80, // FIXED: Fixed height to prevent stretching
  },
  statCardActive: { borderColor: '#143470' },
  statCount: { fontSize: 24, fontWeight: 'bold', color: '#143470' },
  statLabel: { 
    fontSize: 10, 
    color: '#666', 
    marginTop: 4,
    textAlign: 'center',
  },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 15 },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 10,
  },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  ownerName: { fontSize: 14, color: '#666', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  cardBody: { marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 14, color: '#666', marginLeft: 8, flex: 1 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 },
  tapToUpdate: { fontSize: 12, color: '#143470', textAlign: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 16 },
  
  // FIXED: Modal layout improvements
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContentWrapper: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  modalScrollView: {
    maxHeight: '100%',
  },
  modalScrollContent: {
    flexGrow: 1,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInfo: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalInfoText: { fontSize: 14, color: '#666', marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  statusButtonActive: { backgroundColor: '#f0f0f0' },
  statusButtonText: { fontSize: 12, color: '#666', fontWeight: '500' },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalButtons: { flexDirection: 'row', gap: 10 },
  cancelButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  updateButton: {
    flex: 1,
    backgroundColor: '#143470',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});