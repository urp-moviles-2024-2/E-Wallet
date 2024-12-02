import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, Modal } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { ChevronLeft, HelpCircle, ChevronDown } from 'lucide-react-native';


const PaymentScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const user = FIREBASE_AUTH.currentUser;
  const [showModal, setShowModal] = useState(false);

  const formatDate = () => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', options);
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
      const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const userBalance = userData.saldo || 0;

        if (userBalance < product.precio) {
          Alert.alert("Saldo insuficiente", "No tienes saldo suficiente para realizar esta compra.");
          return;
        }

        await updateDoc(userRef, {
          saldo: userBalance - product.precio,
          transacciones: arrayUnion({
            type: "Enviado",
            amount: product.precio,
            recipientName: product.fuente,
            senderUid: user.uid,
            nombreProducto: product.nombre,
            timestamp: new Date(),
          }),
        });

        const productRef = doc(FIREBASE_DATABASE, "producto", product.id);
        await updateDoc(productRef, {
          cantidad: product.cantidad - 1,
        });

        setShowModal(false);
        Alert.alert("Éxito", "Compra realizada con éxito.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      Alert.alert("Error", "Hubo un problema al procesar el pago.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconos} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Summary Transaction</Text>
        <View style={styles.iconos}>
          <HelpCircle size={24} color="#ffffff" />
        </View>
      </View>
      <View style={styles.containerProductImageDesc}>
        <View style={styles.containerProductImage}>
          <Image
            source={product.imagen}
            style={styles.productImage}
          />
        </View>
        <Text style={styles.fuenteName}>{product.fuente}</Text>
      </View>

      <Text style={styles.paymentOn}>Payment on {formatDate()}</Text>
      <Text style={styles.productPrice}>S/.{parseFloat(product.precio).toFixed(2)}</Text>
      <View style={styles.containerProductName}>
        <Text style={styles.productName}>{product.nombre}</Text>
      </View>
      <View style={styles.containerButtons}>
        <TouchableOpacity style={styles.buttons} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Comprar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Cards</Text>
            {/* <Text style={styles.modalText}>
              You are about to purchase {product.nombre} for S/.{parseFloat(product.precio).toFixed(2)}
            </Text> */}

            <View style={styles.cardContainer}>
              <View style={styles.logoContainer}>
                <Image source={require("../assets/logo.png")} style={styles.logo} />
              </View>
              <View style={styles.cardInfoContainer}>
                <Text style={styles.titleCard}>Wally Virtual Card</Text>
                <Text style={styles.numberCard}>0318-1608-2105</Text>
              </View>
              <View style={styles.cardIconContainer}>
                <ChevronDown size={24} color="#105D38" />
              </View>
            </View>

            <TouchableOpacity style={styles.proceedButton} onPress={handlePayment}>
              <Text style={styles.buttonText}>Proceed to Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.proceedButton, styles.cancelModalButton]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderColor: 'rgba(230, 230, 232, 0.3)',
    borderRadius: 8,
    padding: 4,
    opacity: 20
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  containerProductImage: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
    backgroundColor: "#E3FFEE",
    borderRadius: 8
  },
  containerProductImageDesc: {
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 150,
    height: 150,
  },
  fuenteName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff"
  },
  paymentOn: {
    fontSize: 14,
    marginBottom: 8,
    color: "#FFAE58",
    textAlign: "center"
  },
  containerProductName: {
    width: "90%",
    height: 52,
    padding: 10,
    marginTop: 20,
    backgroundColor: 'rgba(230, 230, 232, 0.3)',
    borderRadius: 16,
    alignSelf: 'center'
  },
  productName: {
    fontSize: 20,
    marginBottom: 8,
    color: "#fff",
  },
  productPrice: {
    fontSize: 48,
    marginBottom: 8,
    fontWeight: 600,
    textAlign: "center",
    color: "#fff",
  },
  productQuantity: {
    fontSize: 16,
    marginBottom: 16,
    color: "#f5f5f5",
  },
  containerButtons: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
    marginTop: 40
  },
  buttons: {
    height: 54,
    width: "40%",
    backgroundColor: "#4CD080",
    display: "flex",
    justifyContent: "center",
    borderRadius: 16,
    margin: 10
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: 500,
    fontSize: 16
  },
  cardContainer: {
    width: '100%',
    backgroundColor: "#F2F2F2",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    backgroundColor: "#fff",
    width: 54,
    height: 44,
    borderRadius: 8
  },
  logo: {
    width: 48,
    height: 48
  },
  titleCard: {
    fontSize: 14,
    fontWeight: 700,
    color: "#000"
  },
  numberCard: {
    fontSize: 12,
    fontWeight: 500,
    color: "#8F92A1"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  proceedButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#4CD080',
    justifyContent: 'center',
    borderRadius: 16,
    marginVertical: 5,
  },
  cancelModalButton: {
    backgroundColor: 'red',
  },
});

export default PaymentScreen;
