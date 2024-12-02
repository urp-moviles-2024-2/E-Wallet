import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import QuickActions from "../components/QuickActions";
import PaymentGrid from "../components/PaymentGrid";
import PromoSection from "../components/PromoSection";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Settings } from "lucide-react-native";

const HomeScreen = () => {
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState([]); // Lista de productos
  const navigation = useNavigation();

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

    const fetchProducts = async () => {
      try {
        const productsRef = collection(FIREBASE_DATABASE, "producto");
        console.log(productsRef);
        const productsQuery = query(productsRef, where("cantidad", ">", 0)); // Solo productos disponibles
        const querySnapshot = await getDocs(productsQuery);

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Agrega el ID del documento
          ...doc.data(),
        }));

        setProducts(productsData);
        console.log(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchUserData();
    fetchProducts();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerfirst}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.iconSettings}>
              <Settings size={20} color="#000" style={styles.icon} />
            </View>
          </View>
          <View style={styles.presentation}>
            <View>
              <Text style={styles.userName}>Hello {userName},</Text>
              <Text style={styles.balance}>Your available balance</Text>
            </View>
            <View style={styles.conteinerCash}>
              <Text style={styles.cash}>S/. {balance}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions and Promotions */}
        <QuickActions />
        <PaymentGrid products={products} />
        <PromoSection products={products} />

        {/* Product List */}
        {/* <Text style={styles.sectionHeading}>Productos Disponibles</Text>
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleProductPress(item)}
          >
            <View style={styles.productItem}>
              <Text style={styles.productName}>{item.nombre}</Text>
              <Text style={styles.productDetails}>
                Precio: S/ {item.precio} | Cantidad: {item.cantidad}
              </Text>
            </View>
          </TouchableOpacity>
        ))} */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 50,
  },
  header: {
    marginBottom: 16,
  },
  headerfirst: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  iconSettings: {
    width: 40,
    height: 40,
    borderWidth: 2, 
    borderColor: "#e6e6e8", 
    borderRadius: 8, 
    padding: 8, 
    alignItems: "center",
    justifyContent: "center", 
  },
  presentation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balance: {
    fontSize: 14,
    color: "#8f92a1",
    marginBottom: 8,
  },
  conteinerCash: {
    paddingLeft: 30,
  },
  cash: {
    fontSize: 28,
    fontWeight: "700",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productDetails: {
    fontSize: 16,
    color: "#555",
  },
  logoImage: {
    width: 50,
    height: 50,
  },
});

export default HomeScreen;
