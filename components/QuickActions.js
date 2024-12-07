// src/components/QuickActions.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Clock } from "lucide-react-native";

const QuickActions = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate("History")} // Navega al historial
      >
        <Clock name="clock" size={20} marginRight={10} color="#fff" style={styles.icon} />  {/* Icono de reloj */}
        <Text style={styles.actionText}>History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quickActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#22c55e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 10
  },
  actionText: {
    color: "white",
    marginTop: 4,
  },
});

export default QuickActions;
