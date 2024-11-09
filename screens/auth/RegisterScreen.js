import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  View,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { addDoc, collection, getDoc, doc, setDoc, increment } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import bcrypt from "bcryptjs";  // Importa bcryptjs

const RegisterScreen = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const auth = FIREBASE_AUTH;

  const agregarNuevoUsuario = async (nombre, correo, contraseña) => {
    try {
      // Encriptar la contraseña antes de guardarla
      const salt = await bcrypt.genSalt(10);  // Genera un "sal" con 10 rondas
      const hashedPassword = await bcrypt.hash(contraseña, salt);  // Crea el hash de la contraseña
  
      // Crear un nuevo documento con un ID aleatorio en la colección 'usuarios'
      const usuariosRef = collection(FIREBASE_DATABASE, "usuarios");
  
      // Crear el objeto del usuario con la contraseña encriptada
      const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        contraseña: hashedPassword,  // Guarda la contraseña encriptada
      };
  
      // Usamos addDoc para que Firestore cree un documento con un ID aleatorio
      const docRef = await addDoc(usuariosRef, nuevoUsuario);
  
      // Actualiza el documento con el ID del usuario (opcional)
      await setDoc(docRef, {
        id: docRef.id,  // Establece el ID del documento como el 'id' del usuario
        codigoqr: `codigoQR_${docRef.id}`, // Un código QR único basado en el timestamp actual
      }, { merge: true });
  
      console.log("Usuario añadido con ID aleatorio:", docRef.id);
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert("Hubo un problema al registrar el usuario.");
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await agregarNuevoUsuario(nombre, email, password);
      alert("Cuenta creada exitosamente!");
      navigation.navigate("LoginScreen"); // Navegar a Login después de registrarse
    } catch (error) {
      console.error(error);
      alert("Revisa los valores ingresados!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={nombre}
          onChangeText={(text) => setNombre(text)}
          placeholder="Nombre"
          style={styles.input}
        />
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          style={styles.input}
          autoCapitalize="none"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Create Account" onPress={signUp} />
        )}
        <Button
          title="¿Ya tienes una cuenta? Inicia sesión"
          onPress={() => navigation.navigate("LoginScreen")}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
});
