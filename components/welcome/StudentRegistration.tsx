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
  Alert,
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

  const handleNext = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      console.log("Entra al if del password");
      return;
    }
    if (!nombres || !apellidos || !email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      console.log("Entra al if de los campos");
      return;
    }
    try {
      const usuarioData = {
        nombres,
        apellidos,
        correo: email,
        password,
      };

      await createStudents(usuarioData);
      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada exitosamente", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Hubo un problema al registrar el usuario: " + error.message
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
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require("../../assets/icons/arrow.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../assets/icons/signup_estudiantes.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Nueva cuenta</Text>
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
            />
            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              value={apellidos}
              onChangeText={setApellidos}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
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
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Siguiente</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.alternativeButton} 
            onPress={handleAlternativeRegistration}
          >
            <Text style={styles.alternativeButtonText}>
              Usar otro método de registro
            </Text>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    width: 80,
    height: 80,
  },
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
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#0078FF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  alternativeButton: {
    marginTop: 16,
    padding: 12,
  },
  alternativeButtonText: {
    color: "#0078FF",
    fontSize: 16,
    textAlign: "center",
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
});

export default StudentRegistration;
