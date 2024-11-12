import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { loginUsuario } from "../controllers/usuariosController";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginProps {
  navigation?: any;
  onLogin: (role: number) => void;
}

const Login: React.FC<LoginProps> = ({ navigation, onLogin }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usuario = await loginUsuario(correo, password);
      console.log("Usuario logueado:", usuario);
      const usuarioData = {
        id: usuario.id,
        role: usuario.role,
        nombreCompleto: `${usuario.nombres} ${usuario.apellidos}`,
      };
      await AsyncStorage.setItem("usuario", JSON.stringify(usuarioData));
      onLogin(usuario.role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleregister = () => {
    navigation.navigate("Onboarding3");
  };

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS === "ios"}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Image
              source={require("../assets/icons/book.png")}
              style={styles.icon}
            />
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Inicia sesión ahora</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}>
                <Image
                  source={
                    showPassword
                      ? require("../assets/icons/eye.png")
                      : require("../assets/icons/eye-off.png")
                  }
                  style={styles.iconPassword}
                />
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleregister}>
              <Text style={styles.registerButtonText}>Registrar Cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: "100%",
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 20,
  },
  eyeIcon: {
    padding: 10,
  },
  iconPassword: {
    width: 24,
    height: 24,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  socialButtonsContainer: {
    alignItems: "center",
    width: "60%",
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  loginButton: {
    backgroundColor: "#0078FF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    borderColor: "#0078FF",
    borderWidth: 1,
  },
  registerButtonText: {
    color: "#0078FF",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#0078FF",
    fontSize: 16,
    marginTop: 10,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
});

export default Login;
