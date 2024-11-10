// src/screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import QuickActions from "../components/QuickActions";
import PaymentGrid from "../components/PaymentGrid";
import PromoSection from "../components/PromoSection";
import { Settings } from 'lucide-react-native';

const HomeScreen = () => {
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBalance(data.saldo || 0);
          setUserName(data.nombre || "Usuario");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>Hello, {userName},</Text>
          <Text style={styles.balance}>Your available balance: S/ {balance}</Text>
        </View>
        {/* <TouchableOpacity>
          <Settings style={styles.settings} />
        </TouchableOpacity> */}
      </View>
      <QuickActions />
      <PaymentGrid />
      <PromoSection />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balance: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 16,
  },
  // settings: {
  //   right: 10
  // }
});

export default HomeScreen;
