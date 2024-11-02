// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationScreen from './screens/NotificationScreen';
import HomeScreen from './screens/HomeScreen';
import BottomNavigation from './components/BottomNavigation';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <BottomNavigation {...props} />} // Usa BottomNavigation aquí
        screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Statistics" component={StatisticScreen} />
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="Notifications" component={NotificationScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
