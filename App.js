// src/App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotificationScreen from "./screens/NotificationScreen";
import BottomNavigation from "./components/BottomNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import Login from "./screens/auth/LoginScreen";
import Register from "./screens/auth/RegisterScreen";
import StatisticScreen from "./screens/StatisticScreen";
import ScanScreen from "./screens/ScanScreen";
import ProfileScreen from "./screens/ProfileScreen";
import TransactionScreen from "./screens/TransactionScreen";  // Importa la pantalla de transacción
import { FIREBASE_AUTH } from "./config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import PaymentScreen from "./screens/PaymentScreen";
import TransactionHistoryScreen from "./screens/TransactionHistoryScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false); // Cambia el estado de carga después de verificar al usuario
    });
    return unsubscribe; // Limpia la suscripción cuando el componente se desmonta
  }, []);

  if (loading) {
    return null; // O puedes mostrar un indicador de carga mientras espera la verificación del usuario
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
        tabBar={(props) => <BottomNavigation {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#21c45d',
            borderBottomLeftRadius: 20, // Ajusta el radio según prefieras
            borderBottomRightRadius: 20,
            height: 80, // Opcional: ajusta la altura del header si es necesario
            overflow: 'hidden', // Asegura que los bordes redondeados se apliquen correctamente
          },
          headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 20, // Cambia este valor para ajustar el tamaño del texto
            textAlign: 'center',
          },
          headerTitleAlign: 'center', // Centra el texto del título
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Statistics" component={StatisticScreen} />
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="Notifications" component={NotificationScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Transaction" component={TransactionScreen} />
        <Tab.Screen name="PaymentScreen" component={PaymentScreen} />
        <Tab.Screen name="TransactionHistoryScreen" component={TransactionHistoryScreen} />
      </Tab.Navigator>
      
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
