import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { loginUsuario } from "../controllers/usuariosController";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginProps {
  navigation?: any;
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ navigation, onLogin }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
    try {
      setError(null);
      const usuario = await loginUsuario(correo, password);
      console.log("Usuario logueado:", usuario);
      const usuarioData = {
        id: usuario.id,
        nombreCompleto: `${usuario.nombres} ${usuario.apellidos}`,
      };
      await AsyncStorage.setItem("usuario", JSON.stringify(usuarioData));
      onLogin && onLogin(); // Llama a onLogin después de un inicio de sesión exitoso
    } catch (err: any) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleregister = () => {
    navigation.navigate("Onboarding3");
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icons/book.png")} style={styles.icon} />
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
                ? require("../assets/icons/eye.svg")
                : require("../assets/icons/eye-off.png")
            }
            style={styles.iconPassword}
          />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.separator} />

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/icons/google_icon.svg")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/icons/linkedin.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/icons/facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleregister}>
        <Text style={styles.registerButtonText}>Registrar Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    flexDirection: "row",
    justifyContent: "space-between",
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
});

export default Login;
