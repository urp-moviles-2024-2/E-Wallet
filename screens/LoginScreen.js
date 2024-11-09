import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    KeyboardAvoidingView,
  } from "react-native"; // Include Button here
  import React, { useState } from "react";
  import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { FIREBASE_AUTH } from '../config/FirebaseConfig';
  
  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
  
    const auth = FIREBASE_AUTH; // Make sure FIREBASE_AUTH is initialized correctly
  
    const signIn = async () => {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error(error);
        alert("Cuenta no existente!");
      } finally {
        setLoading(false);
      }
    };
  
    const signUp = async () => {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
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
  
  export default Login;
  
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