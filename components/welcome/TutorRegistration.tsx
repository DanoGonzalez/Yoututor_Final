import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, StatusBar, Button, ScrollView, Modal, FlatList, Linking, Alert } from "react-native";
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
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);
  const [modalMateriasVisible, setModalMateriasVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  
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
    console.log("Entramos al next");
    if (!name || !lastName || !email || !password || !confirmPassword || !selectedMateria) {
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
      console.log("Entramos al try");
      const newUser = await createTutor({
        nombres: name,
        apellidos: lastName,
        correo: email,
        password,
        materiasDominadas: [selectedMateria],
      });
      setModalSuccessVisible(true);
      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
      console.log("Usuario");
    } catch (error) {
      setErrorMessage("No se pudo crear la cuenta del tutor. Intenta de nuevo.");
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
        <Image source={require("../../assets/icons/arrow.png")} style={styles.backIcon} />
      </TouchableOpacity>
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
              <Text style={styles.modalText}>¡Tutor creado exitosamente!</Text>
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

          {selectedMateria && (
            <View style={styles.materiaInfo}>
              <Button
                title="Ir al Formulario"
                onPress={() => {
                  const materia = materias.find(m => m.id === selectedMateria);
                  if (materia) {
                    Linking.openURL(materia.url);
                  }
                }}
                color="#0078FF"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.nextButton, !selectedMateria && { backgroundColor: '#A9A9A9' }]}
            onPress={handleNext}
            disabled={!selectedMateria}
          >
            <Text style={styles.nextButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.alternativeButton} onPress={handleAlternativeRegistration}>
            <Text style={styles.alternativeButtonText}>Usar otro método de registro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  nextButton: { backgroundColor: "#0078FF", borderRadius: 8, padding: 16, alignItems: "center", marginTop: 32, width: "100%" },
  nextButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  alternativeButton: { marginTop: 16, padding: 12 },
  alternativeButtonText: { color: "#0078FF", fontSize: 16, textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "#FFFFFF", borderRadius: 8, padding: 20, width: "80%", maxHeight: "70%" },
  modalItem: { padding: 16 },
  modalItemText: { fontSize: 16 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalText: { fontSize: 18, color: "#000", marginBottom: 20, textAlign: "center" },
  closeButton: { backgroundColor: "#0078FF", padding: 10, borderRadius: 5 },
  closeButtonText: { color: "#FFF", fontSize: 16 },
  materiaInfo: { marginTop: 20, alignItems: "center" },
});

export default TutorRegistration;
