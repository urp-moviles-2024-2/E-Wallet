// src/screens/HomeScreen.js
import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import HomeHeader from '../components/HomeHeader';
import QuickActions from '../components/QuickActions';
import PaymentGrid from '../components/PaymentGrid';
import PromoSection from '../components/PromoSection';
import BottomNavigation from '../components/BottomNavigation';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <Text style={styles.balance}>$15,901</Text>
      <QuickActions />
      <PaymentGrid />
      <PromoSection />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 16,
  },
});

export default HomeScreen;