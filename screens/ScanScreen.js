import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [recipientData, setRecipientData] = useState(null);  // Guardar los datos del destinatario
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return; // Prevenir escaneos duplicados
    setScanned(true);
    console.log("Código QR escaneado:", data);

    try {
      // Comprobamos si el código es de un usuario o un producto
      if (data.startsWith("user_")) {
        // Si el código es de un usuario
        const recipientId = data.split('_')[1]; // Extraemos el ID del destinatario

        // Buscar los datos del destinatario en Firebase usando el ID extraído del QR
        const recipientRef = doc(FIREBASE_DATABASE, "usuarios", recipientId);
        const recipientDoc = await getDoc(recipientRef);

        if (recipientDoc.exists()) {
          const recipient = recipientDoc.data();
          setRecipientData({
            recipientUid: recipientId,
            recipientName: recipient.nombre,
            recipientBalance: recipient.saldo || 0,
          });

          // Navegar a la pantalla de transacción con los datos del destinatario
          navigation.navigate("Transaction", {
            recipientData: {
              recipientUid: recipientId,
              recipientName: recipient.nombre,
              recipientBalance: recipient.saldo || 0,
            },
          });
        } else {
          Alert.alert("Error", "No se encontró al destinatario.");
        }
      } else if (data.startsWith("product_")) {
        // Si el código es de un producto
        const productId = data.split('_')[1]; // Extraemos el ID del producto
  
        // Buscar los datos del producto en Firebase usando el ID extraído del QR
        const productRef = doc(FIREBASE_DATABASE, "producto", productId);
        const productDoc = await getDoc(productRef);
  
        if (productDoc.exists()) {
          const product = productDoc.data();
          setRecipientData({
            productName: product.nombre,  // Usamos el nombre del producto
            productPrice: product.precio,
            productQuantity: product.cantidad,
            productSource: product.fuente,
            productCode: product.codigoProducto,
          });
  
          // Navegar a la pantalla de pago con los datos del producto
          navigation.navigate("Payment", {
            product: {
              id: productId,
              nombre: product.nombre,
              precio: product.precio,
              cantidad: product.cantidad,
              fuente: product.fuente,
              codigoProducto: product.codigoProducto,
            },
          });
        } else {
          Alert.alert("Error", "No se encontró el producto.");
        }
      } else {
        Alert.alert("Error", "El código QR no corresponde a un producto válido.");
      }
    } catch (error) {
      console.error("Error al procesar el código QR:", error);
      Alert.alert("Error", "Hubo un problema al procesar el código QR.");
    }
  
    // Restablecer el estado de escaneo después de un tiempo
    setTimeout(() => {
      setScanned(false);
    }, 1000);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para acceder a la cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No tienes permisos para usar la cámara</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <Text style={styles.instructions}>
          Apunta con la cámara al código QR para escanearlo.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ScanScreen;
