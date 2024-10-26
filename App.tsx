import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import YouTutorSplashScreen from "./components/welcome/YouTutorSplashScreen";
import OnboardingScreen from "./components/welcome/onboardingScreen";
import OnboardingScreen2 from "./components/welcome/onboardingScreen2";
import OnboardingScreen3 from "./components/welcome/onboardingScreen3";
import Login from "./components/Login";
import TutorRegistration from "./components/welcome/TutorRegistration";
import StudentRegistration from "./components/welcome/StudentRegistration";
import TabLayout from "./TabNavigator";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <YouTutorSplashScreen onReady={() => setIsLoading(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Onboarding1" component={OnboardingScreen} />
            <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
            <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
            <Stack.Screen name="Login">
              {(props) => <Login {...props} onLogin={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
            <Stack.Screen name="TutorRegistration" component={TutorRegistration} />
            <Stack.Screen name="StudentRegistration" component={StudentRegistration} />
          </>
        ) : (
          <Stack.Screen name="TabLayout" component={TabLayout} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
