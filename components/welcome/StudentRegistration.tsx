import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { StudentRegistrationProps } from "../../types";
import { createStudents } from "../../controllers/usuariosController";

const StudentRegistration: React.FC<StudentRegistrationProps> = ({
  navigation,
}) => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    console.log("Registrando estudiante...");
    if (!nombres || !apellidos || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Por favor, introduce un correo electrónico válido.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      console.log("Creando estudiante...");
      const usuarioData = {
        nombres,
        apellidos,
        correo: email,
        password,
      };

      await createStudents(usuarioData);
      console.log("Estudiante creado exitosamente.");
      Alert.alert("Éxito", "¡Usuario creado exitosamente!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Hubo un problema al registrar el usuario. Intenta de nuevo."
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAlternativeRegistration = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />

      <SafeAreaView style={styles.contentContainer}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.fixedHeader}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Image
                    source={require("../../assets/icons/arrow.png")}
                    style={styles.backIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <View style={styles.iconContainer}>
                  <Image
                    source={require("../../assets/icons/signup_estudiantes.png")}
                    style={styles.icon}
                  />
                </View>
                <Text style={styles.title}>Registro de Estudiante</Text>
                <Text style={styles.subtitle}>
                  Llena el siguiente formulario con tus datos personales. Crea una
                  contraseña y registra una cuenta de correo electrónico.
                </Text>
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombres"
                    value={nombres}
                    onChangeText={setNombres}
                    autoCapitalize="words"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Apellidos"
                    value={apellidos}
                    onChangeText={setApellidos}
                    autoCapitalize="words"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Crear Cuenta</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.alternativeButton}
                    onPress={handleAlternativeRegistration}>
                    <Text style={styles.alternativeButtonText}>
                      Usar otro método de registro
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  fixedHeader: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "transparent",
  },
  backButton: {
    marginLeft: 20,
  },
  backIcon: {
    width: 55,
    height: 55,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: { flexGrow: 1 },
  content: { paddingTop: 80, alignItems: "center" },
  iconContainer: { alignItems: "center", marginBottom: 24 },
  icon: { width: 80, height: 80 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  form: { gap: 16, width: "100%", paddingHorizontal: 20 },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  nextButton: {
    backgroundColor: "#0078FF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
    width: "100%",
  },
  nextButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  alternativeButton: { marginTop: 16, padding: 12 },
  alternativeButtonText: { color: "#0078FF", fontSize: 16, textAlign: "center" },
});

export default StudentRegistration;
