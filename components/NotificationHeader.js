import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Settings } from 'lucide-react-native';

const NotificationHeader = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <ChevronLeft size={24} color="#333" />
    </TouchableOpacity>
    <Text style={styles.title}>Notification</Text>
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
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NotificationHeader;