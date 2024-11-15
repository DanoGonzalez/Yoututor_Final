import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Image } from "react-native";
import HomeScreen from "./components/tabsStudents/index";
import ProfileScreen from "./components/profile";
import MessagesScreen from "./components/messages";
import TutoresScreen from "./components/tabsStudents/tutores";
import TutorDetailsScreen from "./components/tabsStudents/TutorDetailsSreen";
import HomeScreenTutor from "./components/tabsTuthor/index";
import TutoriaDetails from "./components/TutoriaDetails";
import ScheduleConsulting from "./components/tabsTuthor/scheduleConsulting";
import { TabParamList } from "./types";
import { TabLayoutProps } from "./types";
import MessagesIcon from "./assets/NavIcons/Messages.png";
import HomeIcon from "./assets/NavIcons/Home.png";
import ProfileIcon from "./assets/NavIcons/Profile.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminDashboard from "./components/tabsAdmin/index";

import AdminMessages from "./components/tabsAdmin/messages";

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
      <Stack.Screen name="TutoriaDetails" component={TutoriaDetails} />
    </Stack.Navigator>
  );
};

const getHomeComponent = (userRole: number) => {
  switch (userRole) {
    case 1: // Admin
      return AdminDashboard;
    case 2: // Student
      return HomeScreen;
    case 3: // Tutor
      return TutorStack;
    default:
      return HomeScreen;
  }
};

const getMessagesComponent = (userRole: number) => {
  return userRole === 1 ? AdminMessages : MessagesScreen;
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
        tabBarIcon: ({ focused }) => {
          let iconSource;
          switch (route.name) {
            case "Messages":
              iconSource = MessagesIcon;
              break;
            case "Home":
              iconSource = HomeIcon;
              break;
            case "Profile":
              iconSource = ProfileIcon;
              break;
            default:
              iconSource = null;
          }

          return iconSource ? (
            <View style={styles.iconContainer}>
              <Image
                source={iconSource}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? "#0078FF" : "#B0B0B0",
                }}
              />
            </View>
          ) : null;
        },
        tabBarActiveTintColor: "#0078FF",
        tabBarInactiveTintColor: "#B0B0B0",
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      })}>
      <Tab.Screen
        name="Home"
        component={getHomeComponent(userRole)}
        options={{ tabBarLabel: "Inicio" }}
      />
      <Tab.Screen
        name="Messages"
        component={getMessagesComponent(userRole)}
        options={{ tabBarLabel: "Mensajes" }}
      />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreenWrapper onLogout={onLogout} />}
        options={{ tabBarLabel: "Perfil" }}
      />
      
      {/* Solo mostrar estas pantallas para estudiantes (role 2) */}

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
    height: 70,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 0,
    paddingBottom: 15,
    paddingTop: 15,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 3,
  },
  tabBarLabel: {
    fontSize: 12,
  },
});
