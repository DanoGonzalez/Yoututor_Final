// TabNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./components/tabsStudents/index";
import ProfileScreen from "./components/tabsStudents/profile";
import MessagesScreen from "./components/tabsStudents/messages";
import { Image } from "react-native";
import TutoresScreen from "./components/tabsStudents/tutores";
import { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

interface TabLayoutProps {
  onLogout: () => void;
}

const ProfileScreenWrapper: React.FC<{ onLogout: () => void }> = ({
  onLogout,
}) => {
  return <ProfileScreen onLogout={onLogout} />;
};

export default function TabLayout({ onLogout }: TabLayoutProps) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#0078FF",
          height: 65,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#FFFFFF",
        headerShown: false,
      }}>
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/icons/messageTab.png")}
              style={{ tintColor: color, width: 30, height: 30 }}
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
              source={require("./assets/icons/homeTab.png")}
              style={{ tintColor: color, width: 40, height: 40 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreenWrapper onLogout={onLogout} />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/icons/userTab.png")}
              style={{ tintColor: color, width: 35, height: 35 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tutores"
        component={TutoresScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
