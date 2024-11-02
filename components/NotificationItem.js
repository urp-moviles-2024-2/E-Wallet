import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NotificationItem = ({ icon: Icon, title, subtitle, time, type, onPress }) => (
  <TouchableOpacity style={styles.notificationItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: getIconColor(type) }]}>
      {Icon && <Icon size={24} color="white" />}
    </View>
    <View style={styles.contentContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.tagContainer}>
        <Text style={[styles.tag, { color: getTagColor(type) }]}>{type}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const getIconColor = (type) => {
  switch (type.toLowerCase()) {
    case 'promo':
      return '#FF9500';
    case 'info':
      return '#22c55e';
    default:
      return '#007AFF';
  }
};

const getTagColor = (type) => {
  switch (type.toLowerCase()) {
    case 'promo':
      return '#FF9500';
    case 'info':
      return '#22c55e';
    default:
      return '#007AFF';
  }
};

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  tagContainer: {
    marginLeft: 8,
  },
  tag: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default NotificationItem;