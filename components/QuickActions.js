import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RefreshCcw, CreditCard, Clock } from 'lucide-react-native';

const QuickActions = () => (
  <View style={styles.quickActions}>
    {/* Transfer Button */}
    <TouchableOpacity style={[styles.actionButton, styles.withSeparator]}>
      <RefreshCcw size={24} color="white" />
      <Text style={styles.actionText}>Transfer</Text>
    </TouchableOpacity>

    {/* Top Up Button */}
    <TouchableOpacity style={[styles.actionButton, styles.withSeparator]}>
      <CreditCard size={24} color="white" />
      <Text style={styles.actionText}>Top Up</Text>
    </TouchableOpacity>

    {/* History Button */}
    <TouchableOpacity style={styles.actionButton}>
      <Clock size={24} color="white" />
      <Text style={styles.actionText}>History</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row', // Organiza en fila
    justifyContent: 'space-between', // Espaciado uniforme
    backgroundColor: '#4cd080', // Color verde de fondo
    borderRadius: 12, // Bordes redondeados
    padding: 16, // Espaciado interno
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center', // Centra icono y texto
    flex: 1, // Cada botón toma el mismo ancho
    paddingHorizontal: 8, // Espaciado horizontal interno
  },
  withSeparator: {
    borderRightWidth: 1, // Línea separadora a la derecha
    borderColor: 'rgba(255, 255, 255, 0.5)', // Color blanco translúcido
  },
  actionText: {
    color: 'white', // Color del texto
    marginTop: 4, // Espaciado entre icono y texto
  },
});

export default QuickActions;
