import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Settings, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from "@react-navigation/native";

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const user = FIREBASE_AUTH.currentUser;

  const navigation = useNavigation();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) {
          Alert.alert("Error", "No se pudo autenticar al usuario.");
          return;
        }

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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft style={styles.button} color={'#fff'} />
        </TouchableOpacity>
        <Text style={styles.titleHistory}>Historial de Transacciones</Text>
        <TouchableOpacity>
          <Settings style={styles.button} color={'#fff'} />
        </TouchableOpacity>
      </View>
      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>No se encontraron transacciones.</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#105D38',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 150,
    paddingHorizontal: 30,
    marginBottom: 20
  },
  button: {
    size: 24,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#e6e6e8',
    borderRadius: 12,
    padding: 4,
  },
  titleHistory: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    width: "90%",
    alignSelf: "center",
    borderRadius: 16,
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
});

export default TransactionHistoryScreen;
