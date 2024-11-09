import React from "react";
import { Button, View } from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../config/FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const cerrarSesion = async () => {
    try {
      await signOut(FIREBASE_AUTH);  // Cierra la sesión de Firebase
      alert("Sesión cerrada con éxito");
      navigation.replace("LoginScreen");  // Cambia a la pantalla de login
    } catch (error) {
      console.error(error);
      alert("Error al cerrar sesión.");
    }
  };
  

  return (
    <View>
      <Button title="Cerrar sesión" onPress={cerrarSesion} />
    </View>
  );
};

export default ProfileScreen;