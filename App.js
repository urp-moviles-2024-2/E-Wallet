// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationScreen from './screens/NotificationScreen';
import BottomNavigation from './components/BottomNavigation';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import StatisticScreen from './screens/StatisticScreen';
import ScanScreen from './screens/ScanScreen';
import ProfileScreen from './screens/ProfileScreen';
import { FIREBASE_AUTH } from './config/FirebaseConfig';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';


const Tab = createBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    // Escuchar el estado de autenticación del usuario
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('Usuario: ', user);
      setUser(user); // Actualiza el estado del usuario

      setLoading(false); // Cuando termina la verificación, cambiamos el estado de carga
    });
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <BottomNavigation {...props} />} // Usa BottomNavigation aquí
        screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Statistics" component={StatisticScreen} />
            <Tab.Screen name="Scan" component={ScanScreen} />
            <Tab.Screen name="Notifications" component={NotificationScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Tab.Screen name="RegisterScreen" component={RegisterScreen} />
        )}

      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
