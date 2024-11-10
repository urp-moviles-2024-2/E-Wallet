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
    // Dividir el ID del recibidor desde el QR
    const recipientId = data.split('_')[1]; // Asumiendo que el formato es algo como "prefix_uid"
    // console.log('Código QR escaneado:', data); 
    // console.log('ID del destinatario:', recipientId);  

    if (scanned) return; // Prevenir escaneos duplicados

    setScanned(true);

    try {
      // Buscar los datos del destinatario en Firebase usando el ID extraído del QR
      const recipientRef = doc(FIREBASE_DATABASE, "usuarios", recipientId);
      const recipientDoc = await getDoc(recipientRef);

      if (recipientDoc.exists()) {
        const recipient = recipientDoc.data();
        setRecipientData({
          recipientUid: recipientId,  // Usamos el ID extraído del QR
          recipientName: recipient.nombre,
          recipientBalance: recipient.saldo || 0,
        });

        // Imprimir el nombre del destinatario en la consola
        // console.log('Nombre del destinatario:', recipient.nombre);

        // Navegar a la pantalla de transacción con los datos del destinatario
        navigation.navigate("Transaction", { recipientData: {
          recipientUid: recipientId, 
          recipientName: recipient.nombre,
          recipientBalance: recipient.saldo || 0
        } });
      } else {
        Alert.alert("Error", "No se encontró al destinatario.");
      }
    } catch (error) {
      console.error("Error al obtener los datos del destinatario:", error);
      Alert.alert("Error", "Hubo un problema al obtener los datos del destinatario.");
    }

    // Restablece el estado de escaneo después de un tiempo
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
