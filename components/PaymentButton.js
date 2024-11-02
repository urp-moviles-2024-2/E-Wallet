// src/components/PaymentButton.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const PaymentButton = ({ icon: Icon, label }) => (
  <TouchableOpacity style={styles.paymentButton}>
    <View style={styles.iconContainer}>
      <Icon size={24} color="#333" />
    </View>
    <Text style={styles.paymentLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  paymentButton: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default PaymentButton;