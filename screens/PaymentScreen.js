import React from "react";
import { View, Text, StyleSheet, Button, Alert, Image } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { ChevronLeft, HelpCircle } from 'lucide-react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const user = FIREBASE_AUTH.currentUser;

  const formatDate = () => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', options); // Esto formatea la fecha
  };

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
          Alert.alert("Saldo insuficiente", "No tienes saldo suficiente para realizar esta compra.");
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

  const getImageSource = (fuente) => {
    switch (fuente) {
      case "Starbucks Coffee":
        return require('../assets/starbucks-logo.png');
      case "Netflix":
        return require('../assets/netflix_logo.png');
      case "Enel":
        return require('../assets/enel_logo.png');
      default:
        return require('../assets/popeyes_logo.png');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconos}>
          <ChevronLeft size={24} color="#ffffff" />
        </View>
        <Text style={styles.title}>Comprar Producto</Text>
        <View style={styles.iconos}>
          <HelpCircle size={24} color="#ffffff" />
        </View>
      </View>
      <View style={styles.containerProductImageDesc}>
        <View style={styles.containerProductImage}>
          <Image
            source={getImageSource(product.fuente)}
            style={styles.productImage}
          />
        </View>
        <Text style={styles.fuenteName}>{product.fuente}</Text>
      </View>

      <Text style={styles.productName}>Payment on {formatDate()}</Text>
      <Text style={styles.productName}>Producto: {product.nombre}</Text>
      <Text style={styles.productPrice}>Precio: S/ {product.precio}</Text>
      <Text style={styles.productQuantity}>
        Cantidad disponible: {product.cantidad}
      </Text>
      <Button title="Comprar" onPress={handlePayment} />
      <Button title="Cancelar" onPress={() => navigation.goBack()} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#105D38",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconos: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e6e6e8",
    borderRadius: 8,
    padding: 4,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  containerProductImage: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: "#E3FFEE",
    borderRadius: 8
  },
  containerProductImageDesc: {
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 48,
    height: 48,
  },
  fuenteName: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff"
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
});

export default PaymentScreen;
