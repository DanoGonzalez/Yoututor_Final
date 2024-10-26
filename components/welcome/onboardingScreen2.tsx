import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Onboarding2ScreenProps } from "../../types";
const { width } = Dimensions.get("window");

const OnboardingScreen2: React.FC<Onboarding2ScreenProps> = ({ navigation }) => {
  const onFinish = () => {
    navigation.navigate("Onboarding3");
  };

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Image
            source={require("../../assets/icons/arrow.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <Image
            source={require("../../assets/icons/shareyourexp.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Comparte tu experiencia</Text>
          <Text style={styles.description}>
            Supervise su progreso, reciba comentarios de los estudiantes y mejore
            continuamente sus habilidades de tutoría para lograr resultados
            excepcionales.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onFinish}>
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 55,
    height: 55,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#0078FF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen2;
