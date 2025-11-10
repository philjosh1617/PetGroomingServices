import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const HelpSupportScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>HELP/SUPPORT</Text>
        </View>

        {/* Main Content with Gray Background */}
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            
            {/* Main Heading */}
            <Text style={styles.mainHeading}>Need a paw? We're here to help!</Text>
            
            {/* Description Paragraph 1 */}
            <Text style={styles.paragraph}>
              Our support team is always ready to assist you with anything you need — from booking concerns and payment questions to app issues or pet service inquiries.
            </Text>
            
            {/* Description Paragraph 2 */}
            <Text style={styles.paragraph}>
              If something isn't working right, don't worry! Just reach out and we'll make sure everything gets sorted quickly and smoothly.
            </Text>
            
            {/* Contact Section */}
            <View style={styles.contactSection}>
              <Text style={styles.contactTitle}>Contact Us:</Text>
              
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>
                  • Message us through the in-app chat
                </Text>
              </View>
              
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>
                  • Email: levi@example.com
                </Text>
              </View>
              
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>
                  • Phone: 09659753223
                </Text>
              </View>
            </View>
            
            {/* Closing Statement */}
            <Text style={styles.closingText}>
              We're here to make sure your grooming experience stays as happy and stress-free as your pet after a fresh cut!
            </Text>
            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Header
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
    fontSize: 28,
    color: "#ffffffff",
    fontFamily: "LuckiestGuy",
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
  },
  // Gray Background Container
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 25,
  },
  // Content
  content: {
    paddingHorizontal: 25,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 12,
    paddingVertical: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'left',
  },
  contactSection: {
    marginTop: 10,
    marginBottom: 25,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contactItem: {
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  closingText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 22,
    textAlign: 'left',
    marginTop: 10,
  },
});

export default HelpSupportScreen;