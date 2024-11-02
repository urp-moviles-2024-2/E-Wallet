import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});

export default NotificationSection;