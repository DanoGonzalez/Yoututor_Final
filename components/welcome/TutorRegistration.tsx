import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, StatusBar, ScrollView, Button, FlatList, Alert, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { TutorRegistrationProps } from "../../types";
import { getmaterias } from '../../controllers/materiasController';
import { Materia } from '../../models/materias';
import { createTutor } from '../../controllers/usuariosController';

const TutorRegistration: React.FC<TutorRegistrationProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [githubProfile, setGithubProfile] = useState(""); // GitHub profile (mandatory)
  const [linkedinProfile, setLinkedinProfile] = useState(""); // LinkedIn profile (optional)
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);
  const [modalMateriasVisible, setModalMateriasVisible] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const materiasData = await getmaterias();
        setMaterias(materiasData);
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    };
    fetchMaterias();
  }, []);

  const handleNext = async () => {
    if (!name || !lastName || !email || !password || !confirmPassword || !selectedMateria || !githubProfile) {
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
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
      const newUser = await createTutor({
        nombres: name,
        apellidos: lastName,
        correo: email,
        password,
        materiasDominadas: [selectedMateria],
        githubProfile, // Send GitHub profile to the backend
        linkedinProfile, // Send LinkedIn profile to the backend
      });
      Alert.alert("Éxito", "¡Tutor creado exitosamente!");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la cuenta del tutor. Intenta de nuevo.");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image source={require("../../assets/icons/arrow.png")} style={styles.backIcon} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Image source={require("../../assets/icons/signup_tutores.png")} style={styles.icon} resizeMode="contain" />
              </View>
              <Text style={styles.title}>Nueva cuenta</Text>
              <Text style={styles.subtitle}>Llena el siguiente formulario con tus datos personales. Crea una contraseña y registra una cuenta de correo electrónico.</Text>
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Apellidos"
                  value={lastName}
                  onChangeText={setLastName}
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
                <TextInput
                  style={styles.input}
                  placeholder="Perfil de GitHub"
                  value={githubProfile}
                  onChangeText={setGithubProfile}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Perfil de LinkedIn"
                  value={linkedinProfile}
                  onChangeText={setLinkedinProfile}
                />
                <TouchableOpacity onPress={() => setModalMateriasVisible(true)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Selecciona una materia"
                    value={selectedMateria ? materias.find(m => m.id === selectedMateria)?.materia : ""}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
              </View>

              {/* Modal para seleccionar materias */}
              <Modal visible={modalMateriasVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <FlatList
                      data={materias}
                      keyExtractor={(item) => item.id || ""}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.modalItem}
                          onPress={() => {
                            if (item.id) {
                              setSelectedMateria(item.id);
                            }
                            setModalMateriasVisible(false);
                          }}
                        >
                          <Text style={styles.modalItemText}>{item.materia}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    <Button title="Cerrar" onPress={() => setModalMateriasVisible(false)} />
                  </View>
                </View>
              </Modal>

              <TouchableOpacity
                style={[styles.nextButton, { marginTop: 20 }]}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>Crear Cuenta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.alternativeButton} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.alternativeButtonText}>Usar otro método de registro</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 1 },
  backIcon: { width: 55, height: 55 },
  content: { paddingTop: 80, alignItems: "center" },
  iconContainer: { alignItems: "center", marginBottom: 24 },
  icon: { width: 80, height: 80 },
  title: { fontSize: 24, fontWeight: "bold", color: "#000000", textAlign: "center", marginBottom: 12 },
  subtitle: { fontSize: 16, color: "#666666", textAlign: "center", marginBottom: 32, lineHeight: 24 },
  form: { gap: 16, width: "100%" },
  input: { backgroundColor: "#F5F5F5", borderRadius: 8, padding: 16, fontSize: 16, borderWidth: 1, borderColor: "#DDDDDD" },
  nextButton: { backgroundColor: "#0078FF", paddingVertical: 14, borderRadius: 8, alignItems: "center", justifyContent: "center", width: "100%" },
  nextButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  alternativeButton: { marginTop: 12 },
  alternativeButtonText: { fontSize: 14, color: "#0078FF" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 8, width: "80%" },
  modalItem: { paddingVertical: 12 },
  modalItemText: { fontSize: 16 },
});

export default TutorRegistration;
