import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
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

  const agregarNuevoUsuario = async (nombre, correo, uid) => {
    try {
      const usuariosRef = collection(FIREBASE_DATABASE, "usuarios");
      const nuevoUsuario = {
        uid: uid,
        nombre: nombre,
        correo: correo,
        saldo: 0,
        codigoqr: `codigoQR_${uid}`,
        fechaCreacion: new Date().toISOString(),
        compras: [],
        transacciones: [],
      };
      await setDoc(doc(usuariosRef, uid), nuevoUsuario);
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
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={require("../../assets/logo.png")} // Ruta de tu logo
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.formContainer}>
        <KeyboardAvoidingView behavior="padding">
          <Text style={styles.titleRegister}>Sign Up</Text>
          <TextInput
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            placeholder="Name"
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
            <TouchableOpacity style={styles.button} onPress={signUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>
            Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: "40%",
    backgroundColor: "#105D38",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 40,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  formContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: -50,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleRegister: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#105D38",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#888",
    fontSize: 14,
  },
});
