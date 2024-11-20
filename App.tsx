import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import YouTutorSplashScreen from "./components/welcome/YouTutorSplashScreen";
import OnboardingScreen from "./components/welcome/onboardingScreen";
import OnboardingScreen2 from "./components/welcome/onboardingScreen2";
import OnboardingScreen3 from "./components/welcome/onboardingScreen3";
import Login from "./components/Login";
import TutorRegistration from "./components/welcome/TutorRegistration";
import StudentRegistration from "./components/welcome/StudentRegistration";
import TabLayout from "./TabNavigator";
import { RootStackParamList } from "./types";
import ChatScreen from "./components/ChatScreen";
import TutorDetailsScreen from "./components/tabsStudents/TutorDetailsSreen";
import TutoresScreen from "./components/tabsStudents/tutores";
import NotificacionesScreen from "./components/welcome/notificacionesScreen";
import TutoriaDetails from "./components/TutoriaDetails";
import { TabLayoutProps } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<number | null>(null);

  const handleLogin = (role: number) => {

    console.log("HandleLogin llamado con role:", role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await AsyncStorage.getItem("usuario");
        if (user) {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUserRole(userData.role);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user from storage", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
      setIsLoggedIn(false);
      setUserRole(null);
    } catch (error) {
      console.error("Error removing user from storage", error);
    }
  };

  if (isLoading) {
    return <YouTutorSplashScreen onReady={() => setIsLoading(false)} />;
  }

  return (
<NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {!isLoggedIn ? (
      <>
        <Stack.Screen name="Login">
          {(props) => <Login {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="Onboarding1" component={OnboardingScreen} />
        <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
        <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
        <Stack.Screen name="TutorRegistration" component={TutorRegistration} />
        <Stack.Screen name="StudentRegistration" component={StudentRegistration} />
      </>
    ) : (
      <>
        <Stack.Screen name="TabLayout">
          {(props) => (
            <TabLayout
              {...props}
              onLogout={handleLogout}
              userRole={userRole}
            />
          )}
        </Stack.Screen>
        {/* Deja solo una instancia de Chat */}
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerShown: false,
          }}
        />
      </>
    )}
    <Stack.Screen name="Tutores" component={TutoresScreen} />
    <Stack.Screen name="TutorDetailsScreen" component={TutorDetailsScreen} />
    <Stack.Screen name="NotificacionesScreen" component={NotificacionesScreen} />
    <Stack.Screen
        name="TutoriaDetails"
        component={TutoriaDetails as React.ComponentType<any>}
        options={{ headerShown: false }}
      />

  </Stack.Navigator>
</NavigationContainer>
  );
}
