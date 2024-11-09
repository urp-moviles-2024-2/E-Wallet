import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    View,
    Button,
    KeyboardAvoidingView,
  } from "react-native";
  import React, { useState } from "react";
  import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../config/FirebaseConfig';
  import { addDoc, collection, getDoc, doc, setDoc, increment } from "firebase/firestore";
  
  const Register = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
  
    const auth = FIREBASE_AUTH;
  
    // Función para agregar usuario en Firestore con ID incremental
    const agregarNuevoUsuario = async (nombre, correo, contraseña) => {
      const contadorRef = doc(FIREBASE_DATABASE, "e-wallet-db", "contador");
  
      const contadorSnapshot = await getDoc(contadorRef);
      let nuevoId;
  
      if (contadorSnapshot.exists()) {
        nuevoId = contadorSnapshot.data().contador + 1;
        await setDoc(contadorRef, { contador: increment(1) }, { merge: true });
      } else {
        nuevoId = 1;
        await setDoc(contadorRef, { contador: 1 });
      }
  
      const nuevoUsuario = {
        id: nuevoId,
        nombre: nombre,
        correo: correo,
        contraseña: contraseña,
        codigoqr: `codigoQR${nuevoId}`
      };
  
      const usuariosRef = collection(FIREBASE_DATABASE, "e-wallet-db", "usuarios");
      await addDoc(usuariosRef, nuevoUsuario);
  
      console.log("Usuario añadido con ID incremental:", nuevoId);
    };
  
    // Función de registro
    const signUp = async () => {
      setLoading(true);
      try {
        // Crea la cuenta en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
        // Agrega el usuario a Firestore con los datos adicionales
        await agregarNuevoUsuario(nombre, email, password);
        alert("Cuenta creada exitosamente!");
      } catch (error) {
        console.error(error);
        alert("Revisa los valores ingresados!");
      } finally {
        setLoading(false);
      }
    };
  
    // Función de inicio de sesión
    const signIn = async () => {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Inicio de sesión exitoso!");
      } catch (error) {
        console.error(error);
        alert("Error en el inicio de sesión. Verifica tus credenciales!");
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
            <>
              <Button title="Login" onPress={signIn} />
              <Button title="Create Account" onPress={signUp} />
            </>
          )}
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
  