import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import NotificationHeader from "../components/NotificationHeader";
import { FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const images = [
  require("../assets/hot-sale.png"),
  require("../assets/promo.png"),
  require("../assets/promotion.png"),
];

const NotificationScreen = () => {
  const [promotions, setPromotions] = useState({
    today: [],
    yesterday: [],
    last7Days: [],
  });

  const calculateDaysDifference = (date) => {
    const now = new Date();
    const promoDate = new Date(date.seconds * 1000); 
    const diffInTime = now - promoDate;
    return Math.floor(diffInTime / (1000 * 60 * 60 * 24)); 
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const promoRef = collection(FIREBASE_DATABASE, "promo");
        const querySnapshot = await getDocs(promoRef);

        const today = [];
        const yesterday = [];
        const last7Days = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const daysDifference = calculateDaysDifference(data.fechacreacion);

          if (daysDifference === 0) {
            today.push({ id: doc.id, ...data });
          } else if (daysDifference === 1) {
            yesterday.push({ id: doc.id, ...data });
          } else if (daysDifference <= 7) {
            last7Days.push({ id: doc.id, ...data });
          }
        });

        setPromotions({ today, yesterday, last7Days });
      } catch (error) {
        console.error("Error al obtener promociones:", error);
      }
    };

    fetchPromotions();
  }, []);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const renderPromoItem = ({ item }) => (
    <TouchableOpacity style={styles.promoCard}>
      <Image source={getRandomImage()} style={styles.promoImage} /> {/* Imagen aleatoria */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.categoria.toUpperCase()}</Text> {/* Muestra la categoría */}
        <Text style={styles.subtitle}>Descuento: {item.descuento}%</Text> {/* Muestra el descuento */}
      </View>
      <View style={styles.tagContainer}>
        <Text style={styles.tag}>Promo</Text> {/* Etiqueta con fondo verde */}
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      {/* Fondo del encabezado */}
      <View style={styles.header}>
        <NotificationHeader />
        <Text style={styles.headerTitle}></Text>
      </View>
      <View style={styles.promotions}>
        <Text style={styles.sectionTitle}>TODAY</Text>
        <FlatList
          data={promotions.today}
          renderItem={renderPromoItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay promociones para hoy.</Text>}
        />
        <Text style={styles.sectionTitle}>YESTERDAY</Text>
        <FlatList
          data={promotions.yesterday}
          renderItem={renderPromoItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay promociones para ayer.</Text>}
        />
        <Text style={styles.sectionTitle}>LAST 7 DAYS</Text>
        <FlatList
          data={promotions.last7Days}
          renderItem={renderPromoItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay promociones en los últimos 7 días.</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f3f4f6",
    },
    promotions: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      marginTop: 10,
      padding: 16,
      flex: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 12,
    },
    promoCard: {
      flexDirection: "row", // Alinea los elementos horizontalmente
      alignItems: "center",
      backgroundColor: "#f3f4f6",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    promoImage: {
      width: 40, // Tamaño de la imagen
      height: 40,
      marginRight: 12, // Espaciado entre la imagen y el texto
      borderRadius: 8,
    },
    textContainer: {
      flex: 1, // Ocupa el espacio disponible entre la imagen y el texto "Promo"
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#111827",
    },
    subtitle: {
      fontSize: 14,
      color: "#6b7280",
      marginTop: 4,
    },
    tagContainer: {
      backgroundColor: "#d1fae5", // Fondo verde claro
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    tag: {
      color: "#22c55e", // Texto verde
      fontSize: 12,
      fontWeight: "bold",
    },
  });
  

export default NotificationScreen;
