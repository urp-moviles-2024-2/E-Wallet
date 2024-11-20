import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, BarChart2, User, Scan, Bell } from 'lucide-react-native';

const BottomNavigation = ({ navigation }) => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
      <Home size={24} color="#666" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Statistics')}>
      <BarChart2 size={24} color="#666" />
    </TouchableOpacity>
    
    {/* Contenedor del botón Scan con la "hundidura" semicircular */}
    <View style={styles.scanContainer}>
      <TouchableOpacity style={styles.scan} onPress={() => navigation.navigate('Scan')}>
        <Scan size={28} color="#fff" />
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
      <Bell size={24} color="#666" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
      <User size={24} color="#666" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',  // Color de fondo de la barra
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopEndRadius: 20,  // Bordes redondeados de la barra
    borderTopLeftRadius: 20,
    borderWidth: 0,  // Sin borde visible
    shadowColor: '#000',  // Sombra de la barra
    shadowOffset: { width: 0, height: -4 },  // Sombra hacia arriba
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },

  // Contenedor para el efecto de hundimiento en el centro
  scanContainer: {
    position: 'absolute',
    top: -30,  // Eleva el botón más sobre la barra
    left: '50%',  // Centra el botón horizontalmente
    transform: [{ translateX: -30 }],  // Ajusta para centrar completamente
    zIndex: 1,  // Asegura que el botón esté sobre la barra
    height: 60,  // Altura de la "hundidura"
    width: 60,
    borderRadius: 30,  // Forma circular
    backgroundColor: 'transparent',  // Hace transparente el contenedor
  },

  // Botón Scan con sombra
  scan: {
    backgroundColor: '#ffaf59',
    width: 60,
    height: 60,
    borderRadius: 30,  // Botón circular
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // Estilo para los elementos de navegación
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
});

export default BottomNavigation;
