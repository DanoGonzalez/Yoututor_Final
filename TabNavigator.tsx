// Example in App.tsx or navigation.ts

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./components/tabs/index";
import ProfileScreen from "./components/tabs/profile";
import MessagesScreen from "./components/tabs/messages";
import { Image } from "react-native";
import TutoresScreen from "./components/tabs/tutores";
import { TabParamList } from "./types"; // Import the TabParamList type

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabLayout() {
  return (
    <Tab.Navigator
      initialRouteName="Home" // Set the initial route to Home
      screenOptions={{
        tabBarStyle: { backgroundColor: "#0078FF" }, // Color de fondo de la barra
        tabBarActiveTintColor: "#000000", // Color del texto e icono cuando está activo
        tabBarInactiveTintColor: "#FFFFFF", // Color del texto e icono cuando está inactivo
        headerShown: false,
      }}>
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/icons/messageTab.svg")}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/icons/homeTab.svg")}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/icons/userTab.svg")}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Tutores"
        component={TutoresScreen}
        options={{
          tabBarButton: () => null, // This hides the tab button
        }}
      />
    </Tab.Navigator>
  );
}
