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
  Modal,
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
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false); // State for success modal

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    console.log("Registrando estudiante...");
    if (!nombres || !apellidos || !email || !password || !confirmPassword) {
      setErrorMessage("Por favor, completa todos los campos.");
      setModalErrorVisible(true);
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Por favor, introduce un correo electrónico válido.");
      setModalErrorVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setModalErrorVisible(true);
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
      setModalSuccessVisible(true);
      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
    } catch (error: any) {
      setErrorMessage("Hubo un problema al registrar el usuario. Intenta de nuevo.");
      setModalErrorVisible(true);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAlternativeRegistration = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
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
          />
        </View>
        <Text style={styles.title}>Registro de Estudiante</Text>
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
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.alternativeButton} onPress={handleAlternativeRegistration}>
            <Text style={styles.alternativeButtonText}>Usar otro método de registro</Text>
          </TouchableOpacity>
        </View>

        {/* Modal para mostrar mensajes de error */}
        <Modal visible={modalErrorVisible} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{errorMessage}</Text>
              <TouchableOpacity
                onPress={() => {
                  setErrorMessage("");
                  setModalErrorVisible(false);
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para mostrar mensaje de éxito */}
        <Modal visible={modalSuccessVisible} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>¡Usuario creado exitosamente!</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalSuccessVisible(false);
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 1 },
  backIcon: { width: 55, height: 55 },
  content: { paddingTop: 80, alignItems: "center" },
  iconContainer: { alignItems: "center", marginBottom: 24 },
  icon: { width: 80, height: 80 },
  title: { fontSize: 24, fontWeight: "bold", color: "#000000", textAlign: "center", marginBottom: 12 },
  form: { gap: 16, width: "100%", paddingHorizontal: 20 },
  input: { backgroundColor: "#F5F5F5", borderRadius: 8, padding: 16, fontSize: 16, borderWidth: 1, borderColor: "#DDDDDD" },
  nextButton: { backgroundColor: "#0078FF", borderRadius: 8, padding: 16, alignItems: "center", marginTop: 32, width: "100%" },
  nextButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  alternativeButton: { marginTop: 16, padding: 12 },
  alternativeButtonText: { color: "#0078FF", fontSize: 16, textAlign: "center" },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "#FFFFFF", borderRadius: 8, padding: 20, width: "80%", maxHeight: "70%" },
  modalText: { fontSize: 18, color: "#000", marginBottom: 20, textAlign: "center" },
  closeButton: { backgroundColor: "#0078FF", padding: 10, borderRadius: 5 },
  closeButtonText: { color: "#FFF", fontSize: 16 },
});

export default StudentRegistration;
