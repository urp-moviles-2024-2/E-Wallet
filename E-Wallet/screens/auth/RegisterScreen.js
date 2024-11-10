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
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../../config/FirebaseConfig";
import {
  addDoc,
  collection,
  setDoc,
  doc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const auth = FIREBASE_AUTH;

  // Función para registrar un usuario en Firestore después de crearlo en Firebase Auth
  const agregarNuevoUsuario = async (nombre, correo, uid) => {
    try {
      // Crear un nuevo documento en Firestore con el UID del usuario
      const usuariosRef = collection(FIREBASE_DATABASE, "usuarios");

      // Datos del usuario a almacenar
      const nuevoUsuario = {
        uid: uid, // UID del usuario
        nombre: nombre,
        correo: correo,
        saldo: 0, // Inicializa el saldo en 0
        codigoqr: `codigoQR_${uid}`, // Un código QR único basado en el UID
      };

      // Usamos setDoc para establecer los datos del usuario con su UID
      await setDoc(doc(usuariosRef, uid), nuevoUsuario);

      console.log("Usuario añadido con ID:", uid);
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert("Hubo un problema al registrar el usuario.");
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      // Crear usuario con correo y contraseña en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Registrar el usuario en Firestore con su UID
      await agregarNuevoUsuario(nombre, email, user.uid);

      alert("Cuenta creada exitosamente!");
      navigation.navigate("Login"); // Redirigir a la pantalla de login
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("El correo electrónico ya está registrado.");
          break;
        case "auth/invalid-email":
          alert("Correo electrónico no válido.");
          break;
        case "auth/weak-password":
          alert("La contraseña debe tener al menos 6 caracteres.");
          break;
        default:
          console.error(error);
          alert("Error desconocido al registrar la cuenta.");
      }
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
          <Button title="Crear Cuenta" onPress={signUp} disabled={loading} />
        )}
        <Button
          title="¿Ya tienes una cuenta? Inicia sesión"
          onPress={() => navigation.navigate("Login")}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Register;

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
