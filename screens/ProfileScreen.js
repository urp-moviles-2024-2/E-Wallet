import { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
  FlatList,
} from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import QRCode from "react-qr-code";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [personTransactions, setPersonTransactions] = useState([]);
  const [commerceTransactions, setCommerceTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
            fetchTransactions(userDoc.data().transacciones);
          } else {
            Alert.alert("Error", "No se encontró el documento del usuario");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
          Alert.alert("Error", "Hubo un problema al obtener los datos del usuario");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user]);

  const fetchTransactions = (transactions) => {
    if (!transactions) return;

    // Convertir las transacciones de persona y comercio en arrays
    const personTrans = transactions.personas ? Object.values(transactions.personas) : [];
    const commerceTrans = transactions.comercio ? Object.values(transactions.comercio) : [];

    setPersonTransactions(personTrans);
    setCommerceTransactions(commerceTrans);
  };

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "Hubo un problema al cerrar sesión");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!userData) {
    return <Text>No se encontraron datos de usuario</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Perfil de {userData.nombre}</Text>
      <Text>Email: {userData.correo}</Text>
      <Text>Saldo: S/ {isNaN(userData.saldo) ? 0 : userData.saldo}</Text>

      {userData.codigoqr ? (
        <QRCode
          value={userData.codigoqr}
          size={200}
          fgColor="black"
          bgColor="white"
        />
      ) : (
        <Text>No se ha generado un código QR para este usuario.</Text>
      )}

      <Text style={styles.subheading}>Transacciones entre personas:</Text>
      <FlatList
        data={personTransactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const isSender = item.senderUid === user.uid;
          const otherUserName = isSender ? item.recipientName : item.senderName;
          const transactionType = item.type === "Enviado" ? "Transacción a" : "Transacción de";

          return (
            <View style={styles.transactionItem}>
              <Text>{transactionType}: {otherUserName}</Text>
              <Text>Monto: S/ {item.amount}</Text>
              <Text>Fecha: {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text>No hay transacciones recientes entre personas.</Text>}
      />

      <Text style={styles.subheading}>Transacciones de comercio:</Text>
      <FlatList
        data={commerceTransactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const isSender = item.senderUid === user.uid;
          const otherUserName = isSender ? item.recipientName : item.senderName;
          const transactionType = item.type === "Enviado" ? "Compra a" : "Compra de";

          return (
            <View style={styles.transactionItem}>
              <Text>{transactionType}: {otherUserName}</Text>
              {item.nombreProducto && <Text>Producto: {item.nombreProducto}</Text>}
              <Text>Monto: S/ {item.amount}</Text>
              <Text>Fecha: {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text>No hay transacciones recientes de comercio.</Text>}
      />

      <Button title="Cerrar sesión" onPress={handleSignOut} />
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
  },
});

export default ProfileScreen;
