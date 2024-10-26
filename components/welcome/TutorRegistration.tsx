import React, { useState } from "react";
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, StatusBar} from "react-native";
import { useNavigation } from "@react-navigation/native";


interface TutorRegistrationProps {
  onBack?: () => void;
  onNext?: () => void;
}

const TutorRegistration: React.FC<TutorRegistrationProps> = ({
  onBack,
  onNext,
}) => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../assets/icons/signup_tutores.png")}
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
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
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
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>Siguiente</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.alternativeButton}>
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
});

export default TutorRegistration;
