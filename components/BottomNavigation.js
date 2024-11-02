// src/components/BottomNavigation.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, BarChart2, User, Scan, Bell } from 'lucide-react-native';

const BottomNavigation = () => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={styles.navItem}>
    <Home size={24} color="#666" />
    {/* <Home size={24} color="#22c55e" /> */}
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <BarChart2 size={24} color="#666" />
    </TouchableOpacity>
    <TouchableOpacity style={[styles.navItem, styles.scan]}>
      <Scan size={24} color="#666" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Bell size={24} color="#666" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <User size={24} color="#666" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  scan: {
    backgroundColor: '#ffaf59',
    padding: 7,
    borderRadius: 50,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default BottomNavigation;