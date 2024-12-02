import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Importa los íconos de FontAwesome5

const PaymentButton = ({ iconName, label, iconColor, backgroundColor, onPress }) => (
  <TouchableOpacity style={styles.paymentButton} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor }]}>
      <Icon name={iconName} size={30} color={iconColor} />
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
    width: 60,
    height: 60,
    backgroundColor: '#f3f4f6', // Fondo por defecto
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
