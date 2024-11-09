// src/App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotificationScreen from "./screens/NotificationScreen";
import BottomNavigation from "./components/BottomNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import StatisticScreen from "./screens/StatisticScreen";
import ScanScreen from "./screens/ScanScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { FIREBASE_AUTH } from "./config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="LoginScreen">
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomNavigation {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Statistics" component={StatisticScreen} />
    <Tab.Screen name="Scan" component={ScanScreen} />
    <Tab.Screen name="Notifications" component={NotificationScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null; // O puedes mostrar un indicador de carga mientras espera la verificación del usuario
  }

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;