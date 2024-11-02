// src/components/HomeHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';

const HomeHeader = () => (
  <View style={styles.header}>
    <View>
      <Text style={styles.greeting}>Hello Andre,</Text>
      <Text style={styles.balanceLabel}>Your available balance</Text>
    </View>
    <TouchableOpacity>
      <Settings style={styles.settings} />
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
  settings: {
    size: 24,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#e6e6e8',
    borderRadius: 12,
    padding: 4,
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

export default HomeHeader;