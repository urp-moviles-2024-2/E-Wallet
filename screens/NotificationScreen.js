import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ScrollView, SafeAreaView } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE } from "../config/FirebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import moneyIcon from '../assets/money.png';

const images = [
  require("../assets/hot-sale.png"),
  require("../assets/promo.png"),
  require("../assets/promotion.png"),
];

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState({
    today: [],
    yesterday: [],
    last7Days: [],
  });
  const user = FIREBASE_AUTH.currentUser;

  const calculateDaysDifference = (date) => {
    const now = new Date();
    const itemDate = new Date(date.seconds * 1000);
    const diffInTime = now - itemDate;
    return Math.floor(diffInTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let allNotifications = [];

        // Obtener promociones
        const promoRef = collection(FIREBASE_DATABASE, "promo");
        const promoSnapshot = await getDocs(promoRef);
        const promotions = promoSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "Promo", // Identifica como promoción
          ...doc.data(),
          fechacreacion: doc.data().fechacreacion || new Date(),
        }));

        allNotifications = allNotifications.concat(promotions);

        // Obtener transacciones del usuario
        if (user) {
          const userRef = doc(FIREBASE_DATABASE, "usuarios", user.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const transactions = (userData.transacciones || []).map((transaction) => ({
              ...transaction,
              type: "Transaction",
            }));

            allNotifications = allNotifications.concat(transactions);
          }
        }

        const today = [];
        const yesterday = [];
        const last7Days = [];

        allNotifications.forEach((item) => {
          const daysDifference = calculateDaysDifference(item.fechacreacion || item.timestamp);

          if (daysDifference === 0) {
            today.push(item);
          } else if (daysDifference === 1) {
            yesterday.push(item);
          } else if (daysDifference <= 7) {
            last7Days.push(item);
          }
        });

        setNotifications({ today, yesterday, last7Days });
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      {item.type === "Promo" ? (
        <Image source={images[Math.floor(Math.random() * images.length)]} style={styles.promoImage} />
      ) : (
        <Image source={moneyIcon} style={styles.moneyImage} />
      )}

      {/* Texto principal de la notificación */}
      <View style={styles.textContainer}>
        {item.type === "Promo" ? (
          <>
            <Text style={styles.title}>{item.categoria.toUpperCase()}</Text>
            <Text style={styles.subtitle}>Descuento: {item.descuento}%</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Transaction</Text>
            <Text style={styles.subtitle}>
              {item.type === "Recibido" ? "De" : "A"}:{" "}
              {item.type === "Recibido" ? item.senderName : item.recipientName}
            </Text>
            <Text style={styles.transactionAmount}>Monto: S/ {item.amount}</Text>
          </>
        )}
      </View>

      <View style={[styles.tagContainer, item.type === "Promo" ? styles.promoTag : styles.infoTag]}>
        <Text style={styles.tagText}>{item.type === "Promo" ? "Promo" : "Info"}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.notifications}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>TODAY</Text>
          <FlatList
            data={notifications.today}
            renderItem={renderNotificationItem}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay notificaciones para hoy.</Text>}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>YESTERDAY</Text>
          <FlatList
            data={notifications.yesterday}
            renderItem={renderNotificationItem}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay notificaciones para ayer.</Text>}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>LAST 7 DAYS</Text>
          <FlatList
            data={notifications.last7Days}
            renderItem={renderNotificationItem}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay notificaciones en los últimos 7 días.</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  notifications: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  promoImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  },
  moneyImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
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
  transactionAmount: {
    fontSize: 14,
    color: "#22c55e",
    marginTop: 4,
    fontWeight: "bold",
  },
  tagContainer: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  promoTag: {
    backgroundColor: "#d1fae5",
  },
  infoTag: {
    backgroundColor: "#e0f2fe",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e5f9e0",
    textAlign: "center",
    overflow: "hidden",
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginVertical: 8,
  },
});

export default NotificationScreen;
