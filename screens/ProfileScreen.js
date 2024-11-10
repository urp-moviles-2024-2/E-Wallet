import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet, Button, Alert } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth"; // Importa el método signOut de Firebase Authentication
import QRCode from "react-qr-code";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = FIREBASE_AUTH.currentUser; // Obtén el usuario autenticado actualmente

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          // Obtén el documento de Firestore usando el UID del usuario
          const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Guarda los datos del usuario en el estado
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
  }, [user]); // Solo se ejecuta cuando cambia el usuario

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH); // Cierra sesión del usuario
      // console.log("Usuario ha cerrado sesión exitosamente");
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
      <Text>Saldo: ${isNaN(userData.saldo) ? 0 : userData.saldo}</Text>
      {/* Mostrar el código QR */}
      {userData.codigoqr ? (
        <QRCode
          value={userData.codigoqr} // Usamos el código QR del usuario
          size={200} // Tamaño del código QR
          fgColor="black" // Color del código QR
          bgColor="white" // Color de fondo
        />
      ) : (
        <Text>No se ha generado un código QR para este usuario.</Text>
      )}
      {/* Botón para cerrar sesión */}
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
});

export default ProfileScreen;
