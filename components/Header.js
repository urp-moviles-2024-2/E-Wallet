// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';

const Header = () => (
  <View style={styles.header}>
    <View>
      <Text style={styles.greeting}>Hello Andre,</Text>
      <Text style={styles.balanceLabel}>Your available balance</Text>
    </View>
    <TouchableOpacity>
      <Settings size={24} color="#333" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceLabel: {
    color: '#666',
    marginTop: 4,
  },
});

export default Header;