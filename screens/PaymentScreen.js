import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import QRCode from "react-qr-code";

const PaymentScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const user = FIREBASE_AUTH.currentUser;
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      Alert.alert("Error", "No se pudo autenticar al usuario.");
      return;
    }
  
    if (product.cantidad <= 0) {
      Alert.alert("Error", "El producto no está disponible.");
      return;
    }
  
    setLoading(true);  // Iniciar carga

    try {
      // Obtener datos del usuario actual
      const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const userBalance = userData.saldo || 0;
  
        if (userBalance < product.precio) {
          Alert.alert("Saldo insuficiente", "No tienes saldo suficiente para realizar esta compra.");
          setLoading(false);  // Detener carga
          return;
        }
  
        // Actualizar el saldo del usuario
        await updateDoc(userRef, {
          saldo: userBalance - product.precio,
          "transacciones.comercio": arrayUnion({
              type: "Enviado", // Tipo de transacción
              amount: product.precio, // Monto de la transacción
              recipientName: product.fuente, // Fuente del producto
              senderUid: user.uid,
              nombreProducto: product.nombre, // Nombre del producto
              timestamp: new Date(), // Marca de tiempo
          }),
        });
  
        // Actualizar la cantidad del producto
        const productRef = doc(FIREBASE_DATABASE, "producto", product.id);
        await updateDoc(productRef, {
          cantidad: product.cantidad - 1,
        });
  
        Alert.alert("Éxito", "Compra realizada con éxito.");
        navigation.goBack(); // Regresar a la pantalla anterior
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      Alert.alert("Error", "Hubo un problema al procesar el pago.");
    } finally {
      setLoading(false);  // Detener carga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comprar Producto</Text>
      <Text style={styles.productName}>Producto: {product.nombre}</Text>
      <Text style={styles.productPrice}>Precio: S/ {product.precio}</Text>
      <Text style={styles.productQuantity}>
        Cantidad disponible: {product.cantidad}
      </Text>
      {product.codigoProducto ? (
        <QRCode
          value={product.codigoProducto}
          size={200}
          fgColor="black"
          bgColor="white"
        />
      ) : (
        <Text>No se ha generado un código QR para este producto.</Text>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Comprar" onPress={handlePayment} />
      )}
      <Button
        title="Cancelar"
        onPress={() => navigation.goBack()}
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  productName: {
    fontSize: 20,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 8,
    color: "green",
  },
  productQuantity: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
});

export default PaymentScreen;
