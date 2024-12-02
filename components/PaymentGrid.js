import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PaymentButton from './PaymentButton';

const PaymentGrid = ({ products }) => {
  const navigation = useNavigation();

  const electricityProduct = products.find(product => product.categoria === "luz");
  console.log(electricityProduct)

  const handleProductPress = (product) => {
    navigation.navigate("PaymentScreen", { product });
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Payment List</Text>
      <View style={styles.paymentGrid}>
        {electricityProduct && (
          <PaymentButton
            iconName="bolt"
            label="Electricity"
            iconColor="#FFDD00"
            backgroundColor="#F6FAFD"
            onPress={() => handleProductPress(electricityProduct)}
          />
        )}
        <PaymentButton
          iconName="wifi"
          label="Internet"
          iconColor="#FF6E40"
          backgroundColor="#F6FAFD"
        />
        <PaymentButton
          iconName="ticket-alt"
          label="Voucher"
          iconColor="#00C853"
          backgroundColor="#F6FAFD"
        />
        <PaymentButton
          iconName="heartbeat"
          label="Assurance"
          iconColor="#FF5252"
          backgroundColor="#F6FAFD"
        />
        <PaymentButton
          iconName="shopping-cart"
          label="Merchant"
          iconColor="#4CAF50"
          backgroundColor="#F6FAFD"
        />
        <PaymentButton
          iconName="mobile-alt"
          label="Mobile"
          iconColor="#2979FF"
          backgroundColor="#F6FAFD"
        />
        <PaymentButton
          iconName="file-alt"
          label="Bill"
          iconColor="#FF9800"
          backgroundColor="#F6FAFD"
        />
        <PaymentButton
          iconName="th"
          label="More"
          iconColor="#009688"
          backgroundColor="#F6FAFD"
        />
      </View>
    </View>
  );
};

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
