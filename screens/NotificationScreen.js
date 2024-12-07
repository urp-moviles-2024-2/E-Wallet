import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import NotificationHeader from "../components/NotificationHeader";
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


  const renderNotificationItem = ({ item }) => {
    return (
      <View style={styles.notificationCard}>
        { }
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

        { }
        <View style={[styles.tagContainer, item.type === "Promo" ? styles.promoTag : styles.infoTag]}>
          <Text style={styles.tagText}>{item.type === "Promo" ? "Promo" : "Info"}</Text>
        </View>
      </View>
    );
  };

  const hasNotifications = notifications.today.length > 0 || notifications.yesterday.length > 0 || notifications.last7Days.length > 0;

  return (
    <View style={styles.container}>
      <NotificationHeader/>
      <View style={styles.notifications}>
        {!hasNotifications ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay notificaciones</Text>
          </View>
        ) : (
          <>
            {notifications.today.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>TODAY</Text>
                <FlatList
                  data={notifications.today}
                  renderItem={renderNotificationItem}
                  keyExtractor={(item, index) => `${item.type}-${index}`}
                />
              </View>
            )}

            {notifications.yesterday.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>YESTERDAY</Text>
                <FlatList
                  data={notifications.yesterday}
                  renderItem={renderNotificationItem}
                  keyExtractor={(item, index) => `${item.type}-${index}`}
                />
              </View>
            )}

            {notifications.last7Days.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>LAST 7 DAYS</Text>
                <FlatList
                  data={notifications.last7Days}
                  renderItem={renderNotificationItem}
                  keyExtractor={(item, index) => `${item.type}-${index}`}
                />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#105D38',
  },
  notifications: {
    backgroundColor: "#fff",
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
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
  iconContainer: {
    backgroundColor: "#e5f9e0",
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
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
    color: "#22c55e",
  },

  sectionContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "#8F92A1",
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
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
