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
import { setDoc, doc, collection } from "firebase/firestore";
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
      const usuariosRef = collection(FIREBASE_DATABASE, "usuarios");

      // Datos del usuario a almacenar
      const nuevoUsuario = {
        uid: uid,
        nombre: nombre,
        correo: correo,
        saldo: 0,
        codigoqr: `codigoQR_${uid}`,
        fechaCreacion: new Date().toISOString(), // Fecha de creación en formato ISO
        compras: [], // Inicializa el arreglo de compras vacío
        transacciones: [], // Inicializa el arreglo de transacciones vacío
      };

      // Guarda el documento con el UID del usuario
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await agregarNuevoUsuario(nombre, email, user.uid);

      alert("Cuenta creada exitosamente!");
      navigation.navigate("Login");
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
