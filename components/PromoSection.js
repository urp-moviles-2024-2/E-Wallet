// src/components/PromoSection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PromoSection = () => (
  <View style={styles.promoSection}>
    <View style={styles.promoHeader}>
      <Text style={styles.sectionTitle}>Promo & Discount</Text>
      <TouchableOpacity>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.promoCard}>
      <Text style={styles.promoTitle}>30% OFF</Text>
      <Text style={styles.promoSubtitle}>Black Friday deal</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  promoSection: {
    flex: 1,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  seeMore: {
    color: '#22c55e',
  },
  promoCard: {
    backgroundColor: '#064e3b',
    borderRadius: 16,
    padding: 16,
    height: 120,
  },
  promoTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  promoSubtitle: {
    color: 'white',
    marginTop: 8,
  },
});

export default PromoSection;
