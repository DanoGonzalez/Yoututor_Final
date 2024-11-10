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
import { Onboarding3ScreenProps } from "../../types";
const { width } = Dimensions.get("window");

const OnboardingScreen3: React.FC<Onboarding3ScreenProps> = ({ navigation }) => {
  const onTeach = () => {
    navigation.navigate("TutorRegistration");
  };

  const onLearn = () => {
    navigation.navigate("StudentRegistration");
  };

  const onFinish = () => {
    navigation.navigate("Login");
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
            source={require("../../assets/icons/redtutoria.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Únete a la red de Tutoría</Text>
          <Text style={styles.description}>
            Conviértase en parte de una comunidad vibrante de tutores y aprendices
            apasionados, comparta y adquiera conocimientos.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.roleButtons}>
            <TouchableOpacity style={styles.roleButton} onPress={onTeach}>
              <Text style={styles.roleButtonText}>Enseñar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, styles.roleButtonOutline]}
              onPress={onLearn}>
              <Text style={styles.roleButtonTextOutline}>Aprender</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={onFinish}>
            <Text style={styles.buttonText}>Iniciar Sesíon</Text>
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
    top: 30,
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
    paddingTop: 40,
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
  roleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: "#0078FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  roleButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0078FF",
    marginLeft: 10,
    marginRight: 0,
  },
  roleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  roleButtonTextOutline: {
    color: "#0078FF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0078FF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen3;
