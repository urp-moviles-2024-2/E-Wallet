// src/components/PaymentGrid.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap, Wifi, Gift, FileText, ShoppingCart, Smartphone, Grid } from 'lucide-react-native';
import PaymentButton from './PaymentButton';

const PaymentGrid = () => (
  <View>
    <Text style={styles.sectionTitle}>Payment List</Text>
    <View style={styles.paymentGrid}>
      <PaymentButton icon={Zap} label="Electricity" />
      <PaymentButton icon={Wifi} label="Internet" />
      <PaymentButton icon={Gift} label="Voucher" />
      <PaymentButton icon={FileText} label="Assurance" />
      <PaymentButton icon={ShoppingCart} label="Merchant" />
      <PaymentButton icon={Smartphone} label="Mobile" />
      <PaymentButton icon={FileText} label="Bill" />
      <PaymentButton icon={Grid} label="More" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
});

export default PaymentGrid;