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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await AsyncStorage.getItem("usuario");
        if (user) {
          setIsLoggedIn(true);
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
              {(props) => <Login {...props} onLogin={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
            <Stack.Screen name="Onboarding1" component={OnboardingScreen} />
            <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
            <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
            <Stack.Screen name="TutorRegistration" component={TutorRegistration} />
            <Stack.Screen
              name="StudentRegistration"
              component={StudentRegistration}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="TabLayout">
              {(props) => <TabLayout {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
