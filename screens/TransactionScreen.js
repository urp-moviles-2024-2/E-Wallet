import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TextInput, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { FIREBASE_DATABASE, FIREBASE_AUTH } from "../config/FirebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const TransactionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipientData } = route.params || {}; // Recibimos los datos del destinatario

  const [amount, setAmount] = useState("");
  const [senderBalance, setSenderBalance] = useState(0); // Saldo del remitente
  const [senderName, setSenderName] = useState(""); // Nombre del remitente
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSenderBalance(userData.saldo); // Establecer saldo del remitente
          setSenderName(userData.nombre); // Establecer nombre del remitente
        }
      }
    };

    fetchData();
  }, [user]);

  // Función para generar un ID de transacción simple
  const generateTransactionId = () => {
    const timestamp = new Date().toISOString();
    const amountStr = amount.toString();
    const combinedData = `${user.uid}_${recipientData.recipientUid}_${timestamp}_${amountStr}`;

    // Randomizar el string combinando la fecha, monto y IDs de los usuarios
    const transactionId = combinedData
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
    return transactionId; // Devuelve el ID aleatorio como ID de transacción
  };

  const handleTransaction = async () => {
    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      Alert.alert("Error", "Ingrese un monto válido.");
      return;
    }

    if (transferAmount > senderBalance) {
      Alert.alert(
        "Saldo insuficiente",
        "No tienes suficiente saldo para realizar esta transacción."
      );
      return;
    }

    try {
      // Genera el ID único para la transacción
      const transactionId = generateTransactionId();

      // Actualiza el saldo del remitente
      const senderRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
      await updateDoc(senderRef, { saldo: senderBalance - transferAmount });

      // Actualiza el saldo del destinatario
      const recipientRef = doc(
        FIREBASE_DATABASE,
        "usuarios",
        recipientData.recipientUid
      );
      await updateDoc(recipientRef, {
        saldo: recipientData.recipientBalance + transferAmount,
      });

      // Crear el registro de transacción
      const transactionRecord = {
          transactionId, // Añade el ID único de la transacción
          amount: transferAmount,
          senderUid: user.uid,
          senderName, // Nombre del remitente
          recipientUid: recipientData.recipientUid,
          recipientName: recipientData.recipientName, // Nombre del destinatario
          timestamp: new Date(),
      };

      // Añadir la transacción al array `transacciones` en el remitente y destinatario
      await updateDoc(senderRef, {
        "transacciones.personas": arrayUnion({ 
          ...transactionRecord, 
          type: "Enviado" 
        }),
      });
      
      await updateDoc(recipientRef, {
        "transacciones.personas": arrayUnion({ 
          ...transactionRecord, 
          type: "Recibido" 
        }),
      });

      Alert.alert(
        "Transacción realizada",
        `Se ha transferido S/ ${transferAmount} a ${recipientData.recipientName}`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error en la transacción:", error);
      Alert.alert("Error", "Hubo un problema al realizar la transacción.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Iniciar Transacción a {recipientData?.recipientName || "Cargando..."}
      </Text>
      <Text>Saldo actual: S/ {senderBalance}</Text>
      <Text>
        Saldo de {recipientData?.recipientName || "Cargando..."}: S/{" "}
        {recipientData?.recipientBalance || 0}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el monto a transferir"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Confirmar Transacción" onPress={handleTransaction} />
      <Button title="Volver al Escáner" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  instructions: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    width: "80%",
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default TransactionScreen;
