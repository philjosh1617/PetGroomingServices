import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAppointmentContext } from './contexts/AppointmentContext';

const API_URL = 'http://192.168.100.19:3000/api/pets';

type NavItem = { id: string; label: string; active: boolean };
type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  selectedPets: string[];
};
type Pet = { _id: string; name: string; profileImage: string };

const ServicesScreen = () => {
  const { updateAppointmentData } = useAppointmentContext();
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: true },
    { id: '2', label: 'Date', active: false },
    { id: '3', label: 'Payment', active: false },
    { id: '4', label: 'Status', active: false },
    { id: '5', label: 'Like', active: false },
  ]);

  const [pets, setPets] = useState<Pet[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // ✅ NEW: Search state
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Flea Treatment',
      description: 'Gently removes and protects your pet from pests using safe, vet-approved products.',
      price: 350,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '2',
      title: 'Bath & Blow Dry',
      description: 'Give your furry friend the refresh they deserve with gentle wash and soft blow-dry.',
      price: 350,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '3',
      title: 'Teeth Brushing',
      description: 'Keep those pearly whites sparkling with pet-friendly toothpaste.',
      price: 200,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '4',
      title: 'Nail Trimming',
      description: 'Careful nail trimming keeps your pet\'s paws neat and comfortable.',
      price: 150,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '5',
      title: 'Ear Cleaning',
      description: 'Gentle ear cleaning to remove dirt and wax, preventing infections.',
      price: 180,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '6',
      title: 'Haircut & Styling',
      description: 'Professional haircut tailored to breed and style preference.',
      price: 500,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '7',
      title: 'Full Grooming',
      description: 'All-in-one package: bath, blow-dry, haircut, nail trim, and ear cleaning.',
      price: 600,
      quantity: 0,
      selectedPets: []
    }
  ]);

  const [showPetSelection, setShowPetSelection] = useState<string | null>(null);

  // ✅ NEW: Filter services based on search query
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch user's pets
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data);
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    }
  };

  const handleNavPress = (id: string) => {
    setNavigationItems(prevItems =>
      prevItems.map(item => ({ ...item, active: item.id === id }))
    );
  };

  const handleAddPetPress = (serviceId: string) => {
    setShowPetSelection(serviceId);
  };

  const handlePetSelect = (serviceId: string, petId: string) => {
    setServices(prevServices =>
      prevServices.map(service => {
        if (service.id === serviceId) {
          const isPetSelected = service.selectedPets.includes(petId);
          let newSelectedPets;
          
          if (isPetSelected) {
            newSelectedPets = service.selectedPets.filter(id => id !== petId);
          } else {
            newSelectedPets = [...service.selectedPets, petId];
          }
          
          return {
            ...service,
            selectedPets: newSelectedPets,
            quantity: newSelectedPets.length
          };
        }
        return service;
      })
    );
  };

  const handleAddNewPet = () => {
    router.push('/PetProfile/aboutpet');
  };

  const calculateServiceSubtotal = (service: Service) => {
    return service.price * service.quantity;
  };

  const calculateTotal = () => {
    return services.reduce((total, service) => total + calculateServiceSubtotal(service), 0);
  };

  const hasSelectedServices = services.some(service => service.quantity > 0);
  const getPetById = (petId: string) => pets.find(pet => pet._id === petId);

  const handleNext = () => {
    // Get all selected services with pet details
    const selectedServices = services
      .filter(service => service.quantity > 0)
      .map(service => ({
        serviceName: service.title,
        price: service.price,
        petIds: service.selectedPets
      }));

    if (selectedServices.length === 0) {
      Alert.alert('No Services Selected', 'Please select at least one service to continue.');
      return;
    }

    // Get the first selected pet (for now, assuming one pet per appointment)
    const firstServicePet = selectedServices[0].petIds[0];
    const selectedPet = getPetById(firstServicePet);

    if (!selectedPet) {
      Alert.alert('Error', 'Pet not found');
      return;
    }

    // Save to appointment context
    updateAppointmentData({
      petId: selectedPet._id,
      petName: selectedPet.name,
      services: selectedServices.flatMap(service => 
        service.petIds.map(petId => ({
          serviceName: service.serviceName,
          price: service.price
        }))
      ),
      totalAmount: calculateTotal()
    });

    console.log('✅ Services saved to context:', {
      petId: selectedPet._id,
      petName: selectedPet.name,
      totalAmount: calculateTotal()
    });
    
    router.push("/date");
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

      {/* ✅ NEW: Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          hasSelectedServices && styles.scrollContentWithFooter
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Types of Services</Text>
          <Text style={styles.resultsCount}>
            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
          </Text>
        </View>
        
        {filteredServices.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.noResultsText}>No services found</Text>
            <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
          </View>
        ) : (
          filteredServices.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceContent}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.servicePrice}>₱{service.price} per pet</Text>
                    {service.quantity > 0 && (
                      <Text style={styles.serviceSubtotal}>
                        Subtotal: ₱{calculateServiceSubtotal(service)}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.petProfilesContainer}>
                  {service.selectedPets.slice(0, 3).map((petId, index) => {
                    const pet = getPetById(petId);
                    if (!pet) return null;
                    
                    return (
                      <View key={petId} style={styles.petProfile}>
                        <TouchableOpacity 
                          style={styles.profileImageContainer}
                          onPress={() => handleAddPetPress(service.id)}
                        >
                          <View style={styles.profileImage}>
                            <Text style={styles.petEmoji}>🐶</Text>
                          </View>
                          <Text style={styles.tapToChange}>TAP TO CHANGE</Text>
                        </TouchableOpacity>
                        <Text style={styles.petName}>{pet.name}</Text>
                        {index === 2 && service.selectedPets.length > 3 && (
                          <View style={styles.morePetsBadge}>
                            <Text style={styles.morePetsText}>+{service.selectedPets.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                  
                  {service.selectedPets.length === 0 && (
                    <TouchableOpacity 
                      style={styles.emptyPetProfile}
                      onPress={() => handleAddPetPress(service.id)}
                    >
                      <View style={styles.profileImageContainer}>
                        <View style={[styles.profileImage, styles.emptyProfileImage]}>
                          <Text style={styles.plusIcon}>+</Text>
                        </View>
                        <Text style={styles.tapToChange}>TAP TO ADD PET</Text>
                      </View>
                      <Text style={styles.emptyPetText}>Add Pet</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {showPetSelection === service.id && (
                <View style={styles.petSelectionModal}>
                  <Text style={styles.petSelectionTitle}>Select Pets for {service.title}</Text>
                  <Text style={styles.petSelectionSubtitle}>Choose from your registered pets</Text>
                  
                  <View style={styles.petsGrid}>
                    {pets.map((pet) => (
                      <TouchableOpacity
                        key={pet._id}
                        style={[
                          styles.petOption,
                          service.selectedPets.includes(pet._id) && styles.petOptionSelected
                        ]}
                        onPress={() => handlePetSelect(service.id, pet._id)}
                      >
                        <View style={styles.petOptionImage}>
                          <Text style={styles.petOptionEmoji}>🐶</Text>
                        </View>
                        <Text style={styles.petOptionName}>{pet.name}</Text>
                        {service.selectedPets.includes(pet._id) && (
                          <View style={styles.selectedIndicator}>
                            <Text style={styles.selectedIndicatorText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                    
                    <TouchableOpacity 
                      style={styles.addNewPetOption}
                      onPress={handleAddNewPet}
                    >
                      <View style={styles.addNewPetIcon}>
                        <Text style={styles.addNewPetText}>+</Text>
                      </View>
                      <Text style={styles.addNewPetLabel}>Add New</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.modalButtons}>
                    <TouchableOpacity 
                      style={styles.cancelSelectionButton}
                      onPress={() => setShowPetSelection(null)}
                    >
                      <Text style={styles.cancelSelectionText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.doneSelectionButton}
                      onPress={() => setShowPetSelection(null)}
                    >
                      <Text style={styles.doneSelectionText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {hasSelectedServices && (
        <View style={styles.bottomFooter}>
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>₱{calculateTotal()}</Text>
            </View>
            <Text style={styles.totalNote}>Includes all selected services for all pets</Text>
          </View>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}
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
  
  // ✅ NEW: Search bar styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  
  scrollContent: { flexGrow: 1, padding: 16, paddingBottom: 16 },
  scrollContentWithFooter: { paddingBottom: 140 },
  
  // ✅ NEW: Section header with results count
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  
  // ✅ NEW: No results styles
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
  
  serviceCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  serviceContent: { flexDirection: 'row', justifyContent: 'space-between' },
  serviceInfo: { flex: 1, marginRight: 16 },
  serviceTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  serviceDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 16 },
  priceContainer: { marginTop: 8 },
  servicePrice: { fontSize: 16, fontWeight: 'bold', color: '#143470', marginBottom: 4 },
  serviceSubtotal: { fontSize: 14, color: '#DB6309', fontWeight: '500' },
  petProfilesContainer: { width: 90, alignItems: 'center' },
  petProfile: { alignItems: 'center', marginBottom: 12, position: 'relative' },
  profileImageContainer: { alignItems: 'center', marginBottom: 4 },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#143470',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyProfileImage: { borderStyle: 'dashed', borderColor: '#999' },
  petEmoji: { fontSize: 20 },
  plusIcon: { fontSize: 20, color: '#999', fontWeight: 'bold' },
  tapToChange: { fontSize: 8, color: '#666', marginTop: 2 },
  petName: { fontSize: 12, color: '#333', fontWeight: '500', textAlign: 'center' },
  morePetsBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#DB6309',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePetsText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  emptyPetProfile: { alignItems: 'center', justifyContent: 'center', height: 80 },
  emptyPetText: { fontSize: 12, color: '#999', textAlign: 'center' },
  petSelectionModal: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  petSelectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  petSelectionSubtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  petsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16, justifyContent: 'center' },
  petOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: 80,
    position: 'relative',
  },
  petOptionSelected: { backgroundColor: '#e3f2fd', borderColor: '#143470', borderWidth: 2 },
  petOptionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  petOptionEmoji: { fontSize: 18 },
  petOptionName: { fontSize: 12, color: '#333', fontWeight: '500', textAlign: 'center' },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#143470',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  addNewPetOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: 80,
    borderWidth: 2,
    borderColor: '#143470',
    borderStyle: 'dashed',
  },
  addNewPetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#143470',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addNewPetText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  addNewPetLabel: { fontSize: 12, color: '#143470', fontWeight: 'bold', textAlign: 'center' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelSelectionButton: { flex: 1, backgroundColor: '#999', padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelSelectionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  doneSelectionButton: { flex: 1, backgroundColor: '#DB6309', padding: 12, borderRadius: 8, alignItems: 'center' },
  doneSelectionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  totalSection: { backgroundColor: '#f8f8f8', padding: 16, borderRadius: 10, marginBottom: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#DB6309' },
  totalNote: { fontSize: 12, color: '#666', textAlign: 'center' },
  nextButton: {
    backgroundColor: '#DB6309',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
});

export default ServicesScreen;