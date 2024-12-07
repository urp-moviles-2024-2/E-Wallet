import React from "react";
import { View, Text, StyleSheet, Button, Alert, Image, TouchableOpacity } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const PaymentScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const user = FIREBASE_AUTH.currentUser;

  const handlePayment = async () => {
    if (!user) {
      Alert.alert("Error", "No se pudo autenticar al usuario.");
      return;
    }

    if (product.cantidad <= 0) {
      Alert.alert("Error", "El producto no está disponible.");
      return;
    }

    try {
      // Obtener datos del usuario actual
      const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const userBalance = userData.saldo || 0;

        if (userBalance < product.precio) {
          Alert.alert(
            "Saldo insuficiente",
            "No tienes saldo suficiente para realizar esta compra."
          );
          return;
        }

        // Actualizar el saldo del usuario
        await updateDoc(userRef, {
          saldo: userBalance - product.precio,
          transacciones: arrayUnion({
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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comprar Producto</Text>
      <Image
        source={{ uri: product.imagen}}
        style={styles.productImage}
      />
      <Text style={styles.productName}>Producto: {product.nombre}</Text>
      <Text style={styles.productPrice}>Precio: S/ {product.precio}</Text>
      <Text style={styles.productQuantity}>
        Cantidad disponible: {product.cantidad}
      </Text>

      {/* X en la esquina superior derecha */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button width="auto" title="Comprar" onPress={handlePayment}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#105D38",
    alignItems: "center",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  productImage: {
    width: 200,
    height: 200,
  },
  productName: {
    fontSize: 20,
    marginBottom: 8,
    color: "#fff",
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 8,
    color: "#fff",
  },
  productQuantity: {
    fontSize: 16,
    marginBottom: 16,
    color: "#f5f5f5",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 1, // Asegura que la X esté sobre otros elementos
  },
  closeText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "red", // Quita el borde de la X
    paddingHorizontal: 10,
    borderRadius: 50, // Ajusta el radio de la X
    borderWidth: 1,
    borderColor: "#fff",
  },
});

export default PaymentScreen;
