import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Image } from "react-native";
import HomeScreen from "./components/tabsStudents/index";
import ProfileScreen from "./components/profile";
import MessagesScreen from "./components/messages";
import TutoresScreen from "./components/tabsStudents/tutores";
import TutorDetailsScreen from "./components/tabsStudents/TutorDetailsSreen";
import HomeScreenTutor from "./components/tabsTuthor/index";
import ScheduleConsulting from "./components/tabsTuthor/scheduleConsulting";
import { TabParamList } from "./types";
import { TabLayoutProps } from "./types";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator();

const ProfileScreenWrapper: React.FC<{ onLogout: () => void }> = ({
  onLogout,
}) => {
  return <ProfileScreen onLogout={onLogout} />;
};

const TutorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TutorHome" component={HomeScreenTutor} />
      <Stack.Screen name="ScheduleConsulting" component={ScheduleConsulting} />
    </Stack.Navigator>
  );
};

export default function TabLayout({ onLogout, userRole }: TabLayoutProps) {
  console.log("User role: ", userRole);
  if (userRole === null || userRole === undefined) {
    // AsyncStorage.removeItem('usuario')
    // .then(() => {
    //   console.log('Usuario eliminado de AsyncStorage');
    // })
    // .catch((error) => {
    //   console.error('Error al eliminar el usuario de AsyncStorage:', error);
    // });
    return null;
  }
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconSource;
          switch (route.name) {
            case "Messages":
              iconSource = require("./assets/icons/messageTab.png");
              break;
            case "Home":
              iconSource = require("./assets/icons/homeTab.png");
              break;
            case "Profile":
              iconSource = require("./assets/icons/userTab.png");
              break;
            default:
              iconSource = null;
          }

          return (
            <Image
              source={iconSource}
              style={[
                styles.icon,
                { tintColor: focused ? "#0078FF" : color },
                focused && styles.activeIconShadow,
              ]}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: "#0078FF",
        tabBarInactiveTintColor: "#B0B0B0",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
      })}>
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen
        name="Home"
        component={userRole === 3 ? TutorStack : HomeScreen}
      />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreenWrapper onLogout={onLogout} />}
      />

      {/* Pantallas específicas para estudiantes (role 2) */}
      {userRole === 2 && (
        <>
          <Tab.Screen
            name="Tutores"
            component={TutoresScreen}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="TutorDetailsScreen"
            component={TutorDetailsScreen}
            options={{ tabBarButton: () => null }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    height: 65,
    borderRadius: 30,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 0,
  },
  icon: {
    width: 30,
    height: 30,
  },
  activeIconShadow: {
    shadowColor: "#0078FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});
