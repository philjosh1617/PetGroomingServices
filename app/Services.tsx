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
};

const ServicesScreen = () => {
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([
    { id: '1', label: 'Services', active: true },
    { id: '2', label: 'Date', active: false },
    { id: '3', label: 'Payment', active: false },
    { id: '4', label: 'Status', active: false },
    { id: '5', label: 'Like', active: false },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Flea Treatment',
      description: 'Gently removes and protects your pet from pests using safe, vet-approved products — keeping them clean, comfortable, and worry-free!',
      price: 350,
      quantity: 0
    },
    {
      id: '2',
      title: 'Bath & Blow Dry',
      description: 'Give your furry friend the refresh they deserve! Our Bath & Blow Dry service includes a gentle wash using pet-safe shampoo, followed by a soft blow-dry that leaves their coat clean, shiny, and fluffy. Perfect for keeping your pet fresh between grooming sessions.',
      price: 350,
      quantity: 0
    },
    {
      id: '3',
      title: 'Teeth Brushing',
      description: 'Keep those pearly whites sparkling! We use pet-friendly toothpaste to gently clean your pet\'s teeth and gums, helping prevent plaque buildup and bad breath for a healthier smile and happier kisses.',
      price: 200,
      quantity: 0
    },
    {
      id: '4',
      title: 'Nail Trimming',
      description: 'Long nails can cause discomfort and health issues. Our careful nail trimming keeps your pet\'s paws neat and comfortable, ensuring safer playtime and better posture — all without the stress!',
      price: 150,
      quantity: 0
    },
    {
      id: '5',
      title: 'Ear Cleaning',
      description: 'We gently clean your pet\'s ears to remove dirt, wax, and odor-causing buildup. Regular ear cleaning helps prevent infections and keeps your furry companion comfortable and healthy.',
      price: 180,
      quantity: 0
    },
    {
      id: '6',
      title: 'Haircut & Styling',
      description: 'Give your pet a fresh new look! From breed-specific cuts to custom styles, our groomers craft each trim with precision and care. Whether it\'s a classic cut or something trendy, your pet will walk out runway-ready!',
      price: 500,
      quantity: 0
    },
    {
      id: '7',
      title: 'Full Grooming',
      description: 'Our all-in-one pampering package! Includes bath, blow-dry, haircut, nail trimming, ear cleaning, and styling — everything your pet needs to look and feel their absolute best. Ideal for complete care and a polished finish.',
      price: 600,
      quantity: 0
    }
  ]);

  const [fontsLoaded] = useFonts({
    LuckiestGuy_400Regular,
  });

  const handleNavPress = (id: string) => {
    setNavigationItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        active: item.id === id
      }))
    );
  };

  const handleQuantityChange = (id: string, change: number) => {
    setServices(prevServices =>
      prevServices.map(service => {
        if (service.id === id) {
          const newQuantity = Math.max(0, service.quantity + change);
          return { ...service, quantity: newQuantity };
        }
        return service;
      })
    );
  };

  const calculateTotal = () => {
    return services.reduce((total, service) => total + (service.price * service.quantity), 0);
  };

  const hasSelectedServices = services.some(service => service.quantity > 0);

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
        <Text style={styles.sectionTitle}>Types of Services</Text>
        
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            {/* Service Header */}
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            
            {/* Plus Buttons Row */}
            <View style={styles.plusButtonsRow}>
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handleQuantityChange(service.id, 1)}
              >
                <Text style={styles.plusButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handleQuantityChange(service.id, 1)}
              >
                <Text style={styles.plusButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handleQuantityChange(service.id, 1)}
              >
                <Text style={styles.plusButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            {/* Add Pet and Price Row */}
            <View style={styles.addPetRow}>
              <View style={styles.addPetContainer}>
                <Text style={styles.addPetText}>
                  {service.quantity > 0 ? `${service.quantity} Pet${service.quantity > 1 ? 's' : ''}` : 'Add Pet'}
                </Text>
                {service.quantity > 0 && (
                  <TouchableOpacity 
                    style={styles.minusButton}
                    onPress={() => handleQuantityChange(service.id, -1)}
                  >
                    <Text style={styles.minusButtonText}>-</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.servicePrice}>P{service.price}</Text>
            </View>
            
            {/* Subtotal */}
            {service.quantity > 0 && (
              <Text style={styles.serviceSubtotal}>
                Subtotal: P{service.price * service.quantity}
              </Text>
            )}
          </View>
        ))}

        {/* Total Section */}
        {hasSelectedServices && (
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>P{calculateTotal()}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Next Button - Only show when services are selected */}
      {hasSelectedServices && (
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => router.push("/date")}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    padding: 16,
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
  plusButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#143470',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  addPetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addPetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addPetText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  minusButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DB6309',
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#143470',
  },
  serviceSubtotal: {
    fontSize: 14,
    color: '#DB6309',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'right',
  },
  totalSection: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  nextButton: {
    backgroundColor: '#DB6309',
    padding: 18,
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