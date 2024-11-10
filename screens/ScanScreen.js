import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null); // Estado para gestionar el permiso de la cámara
  const [scanned, setScanned] = useState(false); // Estado para saber si ya se ha escaneado un código
  const [scanData, setScanData] = useState(null); // Estado para almacenar los datos del código escaneado

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync(); // Solicitar permisos para la cámara
      setHasPermission(status === 'granted'); // Si se conceden permisos, cambia el estado
    })();
  }, []);

  // Función que maneja el escaneo
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true); // Cambiar el estado a true para indicar que ya se escaneó un código
    setScanData(data); // Guardar los datos escaneados
    Alert.alert(`Código QR detectado`, `Tipo: ${type}\nDatos: ${data}`, [
      { text: 'Cerrar', onPress: () => setScanned(false) },
    ]);
  };

  // Si no se ha concedido permiso para usar la cámara
  if (hasPermission === null) {
    return <Text>Solicitando permiso para acceder a la cámara...</Text>;
  }

  // Si el permiso no fue concedido
  if (hasPermission === false) {
    return <Text>No tienes permisos para usar la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Datos del QR: {scanData}</Text>
          <Button title={'Escanear otro código'} onPress={() => setScanned(false)} />
        </View>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <Text style={styles.instructions}>
        Apunta con la cámara al código QR para escanearlo.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ScanScreen;
