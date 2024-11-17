import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Button } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import QRCode from "react-qr-code";

// Importa la imagen del perfil
import userImage from "../assets/user.png";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!userData) {
    return <Text style={styles.loading}>Cargando datos...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={userImage} style={styles.avatar} />
        <Text style={styles.userName}>{userData.nombre}</Text>
        <Text style={styles.email}>{userData.correo}</Text>
        <Text style={styles.balance}>Saldo disponible: S/ {userData.saldo}</Text>
      </View>

      {/* QR Code Section */}
      <View style={styles.qrContainer}>
        <QRCode value={userData.codigoqr || "Sin QR"} size={300} /> {}
        <Text style={styles.qrText}>Código QR</Text>
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutContainer}>
        <Button title="Cerrar sesión" onPress={handleSignOut} color="#FF4D4F" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  header: {
    backgroundColor: "#105D38",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#d1fae5",
    marginBottom: 10,
  },
  balance: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6b7280",
  },
  signOutContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loading: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 50,
  },
});

export default ProfileScreen;
