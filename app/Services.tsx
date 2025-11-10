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
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Ionicons } from '@expo/vector-icons'; // Added icon import

type NavItem = {
  id: string;
  label: string;
  active: boolean;
};

type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  selectedPets: string[];
};

type Pet = {
  id: string;
  name: string;
  type: 'dog' | 'cat';
};

const ServicesScreen = () => {
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: true },
    { id: '2', label: 'Date', active: false },
    { id: '3', label: 'Payment', active: false },
    { id: '4', label: 'Status', active: false },
    { id: '5', label: 'Like', active: false },
  ]);

  const [pets, setPets] = useState<Pet[]>([
    { id: '1', name: 'Buddy', type: 'dog' },
    { id: '2', name: 'Mittens', type: 'cat' },
    { id: '3', name: 'Max', type: 'dog' },
    { id: '4', name: 'Luna', type: 'cat' },
    { id: '5', name: 'Charlie', type: 'dog' },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Flea Treatment',
      description: 'Gently removes and protects your pet from pests using safe, vet-approved products — keeping them clean, comfortable, and worry-free!',
      price: 350,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '2',
      title: 'Bath & Blow Dry',
      description: 'Give your furry friend the refresh they deserve! Our Bath & Blow Dry service includes a gentle wash using pet-safe shampoo, followed by a soft blow-dry that leaves their coat clean, shiny, and fluffy. Perfect for keeping your pet fresh between grooming sessions.',
      price: 350,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '3',
      title: 'Teeth Brushing',
      description: 'Keep those pearly whites sparkling! We use pet-friendly toothpaste to gently clean your pet\'s teeth and gums, helping prevent plaque buildup and bad breath for a healthier smile and happier kisses.',
      price: 200,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '4',
      title: 'Nail Trimming',
      description: 'Long nails can cause discomfort and health issues. Our careful nail trimming keeps your pet\'s paws neat and comfortable, ensuring safer playtime and better posture — all without the stress!',
      price: 150,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '5',
      title: 'Ear Cleaning',
      description: 'We gently clean your pet\'s ears to remove dirt, wax, and odor-causing buildup. Regular ear cleaning helps prevent infections and keeps your furry companion comfortable and healthy.',
      price: 180,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '6',
      title: 'Haircut & Styling',
      description: 'Give your pet a fresh new look! From breed-specific cuts to custom styles, our groomers craft each trim with precision and care. Whether it\'s a classic cut or something trendy, your pet will walk out runway-ready!',
      price: 500,
      quantity: 0,
      selectedPets: []
    },
    {
      id: '7',
      title: 'Full Grooming',
      description: 'Our all-in-one pampering package! Includes bath, blow-dry, haircut, nail trimming, ear cleaning, and styling — everything your pet needs to look and feel their absolute best. Ideal for complete care and a polished finish.',
      price: 600,
      quantity: 0,
      selectedPets: []
    }
  ]);

  const [showPetSelection, setShowPetSelection] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    LuckiestGuy_400Regular,
  });

  const handleBackPress = () => {
    router.push('/home'); // Navigate to home screen
  };

  const handleNavPress = (id: string) => {
    setNavigationItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        active: item.id === id
      }))
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
    // Navigate to aboutpet screen
    router.push('/aboutpet');
  };

  const calculateServiceSubtotal = (service: Service) => {
    return service.price * service.quantity;
  };

  const calculateTotal = () => {
    return services.reduce((total, service) => total + calculateServiceSubtotal(service), 0);
  };

  const hasSelectedServices = services.some(service => service.quantity > 0);

  const getPetById = (petId: string) => {
    return pets.find(pet => pet.id === petId);
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

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

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          hasSelectedServices && styles.scrollContentWithFooter
        ]}
      >
        <Text style={styles.sectionTitle}>Types of Services</Text>
        
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceContent}>
              {/* Left Side - Service Info */}
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                {/* Price and Subtotal */}
                <View style={styles.priceContainer}>
                  <Text style={styles.servicePrice}>P{service.price} per pet</Text>
                  {service.quantity > 0 && (
                    <Text style={styles.serviceSubtotal}>
                      Subtotal: P{calculateServiceSubtotal(service)}
                    </Text>
                  )}
                </View>
              </View>

              {/* Right Side - Selected Pet Profiles */}
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
                          <Text style={styles.petEmoji}>
                            {pet.type === 'dog' ? '🐶' : '🐱'}
                          </Text>
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
                
                {/* Empty state - This now acts as the Add Pet button */}
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

            {/* Pet Selection Modal */}
            {showPetSelection === service.id && (
              <View style={styles.petSelectionModal}>
                <Text style={styles.petSelectionTitle}>Select Pets for {service.title}</Text>
                <Text style={styles.petSelectionSubtitle}>Choose from your registered pets</Text>
                
                <View style={styles.petsGrid}>
                  {pets.map((pet) => (
                    <TouchableOpacity
                      key={pet.id}
                      style={[
                        styles.petOption,
                        service.selectedPets.includes(pet.id) && styles.petOptionSelected
                      ]}
                      onPress={() => handlePetSelect(service.id, pet.id)}
                    >
                      <View style={styles.petOptionImage}>
                        <Text style={styles.petOptionEmoji}>
                          {pet.type === 'dog' ? '🐶' : '🐱'}
                        </Text>
                      </View>
                      <Text style={styles.petOptionName}>{pet.name}</Text>
                      {service.selectedPets.includes(pet.id) && (
                        <View style={styles.selectedIndicator}>
                          <Text style={styles.selectedIndicatorText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  {/* Add New Pet Option - Now linked to aboutpet */}
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
        ))}
      </ScrollView>

      {/* Bottom Footer with Total and Next Button */}
      {hasSelectedServices && (
        <View style={styles.bottomFooter}>
          {/* Total Section */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>P{calculateTotal()}</Text>
            </View>
            <Text style={styles.totalNote}>Includes all selected services for all pets</Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => router.push("/date")}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    fontSize: 28, // Reduced from 35 to fit better with back button
    color: "#ffffffff",
    fontFamily: "LuckiestGuy",
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 5, height: 7 },
    textShadowRadius: 1,
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
    marginLeft: 15, // Compensate for back button space
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
    flexGrow: 1,
    padding: 16,
    paddingBottom: 16,
  },
  scrollContentWithFooter: {
    paddingBottom: 140, // Extra space for the footer
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
  serviceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    marginTop: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#143470',
    marginBottom: 4,
  },
  serviceSubtotal: {
    fontSize: 14,
    color: '#DB6309',
    fontWeight: '500',
  },
  petProfilesContainer: {
    width: 90,
    alignItems: 'center',
  },
  petProfile: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
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
  emptyProfileImage: {
    borderStyle: 'dashed',
    borderColor: '#999',
  },
  petEmoji: {
    fontSize: 20,
  },
  plusIcon: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  tapToChange: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  petName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
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
  morePetsText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyPetProfile: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  emptyPetText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  petSelectionModal: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  petSelectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  petSelectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  petOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: 80,
    position: 'relative',
  },
  petOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#143470',
    borderWidth: 2,
  },
  petOptionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  petOptionEmoji: {
    fontSize: 18,
  },
  petOptionName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
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
  selectedIndicatorText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
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
  addNewPetText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addNewPetLabel: {
    fontSize: 12,
    color: '#143470',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelSelectionButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelSelectionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneSelectionButton: {
    flex: 1,
    backgroundColor: '#DB6309',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneSelectionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  totalSection: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DB6309',
  },
  totalNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#DB6309',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ServicesScreen;