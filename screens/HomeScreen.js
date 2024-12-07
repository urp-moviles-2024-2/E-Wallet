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
import ProductSection from "../components/ProductSection";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

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
        const productsQuery = query(productsRef, where("cantidad", ">", 0)); // Solo productos disponibles
        const querySnapshot = await getDocs(productsQuery);

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Agrega el ID del documento
          ...doc.data(),
        }));

        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchUserData();
    fetchProducts();
  }, []);

  const handleProductPress = (product) => {
    navigation.navigate("PaymentScreen", { product });
  };

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
          </View>
          <View style={styles.presentation}>
            <View>
              <Text style={styles.userName}>Hello {userName},</Text>
              <Text style={styles.balance}>Your available balance S/. {balance}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions and Promotions */}
        <QuickActions />
        <PaymentGrid />
        <ProductSection products={products} />

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
  },
  header: {
    marginBottom: 16,
  },
  headerfirst: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  presentation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balance: {
    fontSize: 19,
    color: "#8f92a1",
    fontWeight: "bold",
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
    fontSize: 40,
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
