import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  View,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const auth = FIREBASE_AUTH;

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
          <Button title="Login" onPress={signIn} />
        )}
        <Button
          title="¿No tienes una cuenta? ¡Regístrate!"
          onPress={() => navigation.navigate("Register")}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

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
