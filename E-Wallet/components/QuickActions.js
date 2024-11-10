// src/components/QuickActions.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const QuickActions = () => (
  <View style={styles.quickActions}>
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionText}>Transfer</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionText}>Top Up</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton}>
      <Text style={styles.actionText}>History</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginTop: 4,
  },
});

export default QuickActions;