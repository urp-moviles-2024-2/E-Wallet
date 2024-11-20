import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
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
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Image source={require("../../assets/logo.png")} style={styles.logoImage} resizeMode="contain"/>
        </View>
      </View>
      <View style={styles.formContainer}>
        <KeyboardAvoidingView behavior="padding">
          <Text style={styles.titleLogin}>Login</Text>
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
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default LoginScreen;

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
  titleLogin: {
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
  registerLink: {
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#888",
    fontSize: 14,
  },
});
