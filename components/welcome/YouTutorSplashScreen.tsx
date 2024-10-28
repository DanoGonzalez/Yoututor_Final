import React, { useCallback, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useFonts, Roboto_400Regular } from "@expo-google-fonts/roboto";
import * as SplashScreen from "expo-splash-screen";

const YouTutorSplashScreen: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-cargar fuentes, hacer llamadas a API, etc.
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simular un tiempo de carga
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
          onReady();
        }
      }
    }

    prepare();
  }, [fontsLoaded, onReady]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/icons/book.png")} style={styles.icon} />
      <Text style={styles.title}>YouTutor</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0078FF",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: "#FFFFFF",
    fontFamily: "Roboto_400Regular",
  },
});

export default YouTutorSplashScreen;
