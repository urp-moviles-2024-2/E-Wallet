import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const TransactionHistoryScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) {
          Alert.alert("Error", "No se pudo autenticar al usuario.");
          return;
        }

        // Referencia al documento del usuario
        const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setTransactions(userData.transacciones || []); 
        } else {
          Alert.alert("Error", "No se encontró información para el usuario.");
        }
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        Alert.alert("Error", "Hubo un problema al cargar las transacciones.");
      }
    };

    fetchTransactions();
  }, [user]);

  const handleTransfer = (recipientData) => {
    // Asegúrate de que recipientData contiene la información del usuario
    if (recipientData && recipientData.recipientUid) {
      navigation.navigate("Transaction", { recipientData });
    } else {
      console.log("Error: No hay datos de usuario.");
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <Text style={styles.transactionType}>{item.type}</Text>
      <Text style={styles.transactionDetails}>
        Monto: S/ {item.amount} - {item.type === "Recibido" ? "De" : "A"}:{" "}
        {item.type === "Recibido" ? item.senderName : item.recipientName}
      </Text>
      <Text style={styles.transactionDate}>
        Fecha: {new Date(item.timestamp.seconds * 1000).toLocaleDateString()} -{" "}
        {new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}
      </Text>

      {/* Mostrar el botón Transferir solo si el destinatario es un usuario */}
      {item.type === "Enviado" && item.recipientUid && (
        <TouchableOpacity
          style={styles.transferButton}
          onPress={() => handleTransfer(item)} // Pasa los datos del destinatario
        >
          <Text style={styles.transferButtonText}>Transferir</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Transacciones</Text>
      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>No se encontraron transacciones.</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => item.transactionId || index.toString()}
          contentContainerStyle={styles.flatListContent} // Asegura espacio adicional al final
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#22c55e",
  },
  transactionDetails: {
    fontSize: 14,
    color: "#374151",
    marginTop: 8,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 20,
  },
  transferButton: {
    marginTop: 12,
    backgroundColor: "#1e3a8a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  transferButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 20,  // Asegura que haya espacio extra al final
  },
});

export default TransactionHistoryScreen;
