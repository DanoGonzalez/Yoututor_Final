import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreenNavigationProp, ProfileScreenProps } from "../../types";
import { getUsuario } from "../../controllers/usuariosController"; // Asegúrate de importar correctamente
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [usuario, setUsuario] = useState<any>(null); // Cambiar `any` por tu tipo de usuario si tienes uno
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
      const usuario = await AsyncStorage.getItem("usuario");
      console.log("Valor de usuario después de eliminar:", usuario);
      onLogout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al eliminar el usuario de AsyncStorage:", error);
    }
  };

  // Función para cargar los datos del usuario
  const loadUserData = async () => {
    console.log("Cargando datos del usuario...");
    try {
      console.log("Obteniendo datos del usuario...");
      const usuarioData = await AsyncStorage.getItem("usuario");
      console.log("Datos del usuario:", usuarioData); // Verifica que el usuario no sea null
      if (usuarioData) {
        const usuario = JSON.parse(usuarioData); // Parsea el JSON para obtener el objeto
        console.log("Usuario obtenido:", usuario);

        // Aquí puedes usar usuario.id
        const data = await getUsuario(usuario.id); // Llama a la función para obtener datos del usuario
        console.log("Datos del usuario:", data);
        setUsuario(data);
      } else {
        console.log("No se encontró el usuario en AsyncStorage.");
      }
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <ScrollView style={styles.container}>
        <LinearGradient colors={["#0078FF", "#0066DD"]} style={styles.header}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={require("../../assets/icons/profile-picture.png")}
              style={styles.profilePicture}
            />
            <Text style={styles.userName}>
              {usuario ? `${usuario.nombres} ${usuario.apellidos}` : "Usuario"}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue={usuario ? usuario.correo : ""}
              placeholderTextColor="#000000"
              editable={false}
            />
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Intereses</Text>
            <View style={styles.tagsContainer}>
              {usuario?.tecnologias.map((tech: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Método de aprendizaje</Text>
            <TextInput
              style={[styles.infoInput, styles.learningMethodInput]}
              defaultValue={usuario ? usuario.descripcion : ""}
              placeholderTextColor="#000000"
              editable={false}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Plataformas preferidas</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue=""
              placeholderTextColor="#000000"
              editable={false}
            />
          </View>

          <TouchableOpacity style={styles.changeInfoButton}>
            <Text style={styles.changeInfoButtonText}>Cambiar información</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#0078FF",
  },
  header: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureContainer: {
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  content: {
    padding: 20,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
    fontWeight: "500",
  },
  infoInput: {
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  learningMethodInput: {
    minHeight: 100, // Altura mínima fija
    maxHeight: 150, // Altura máxima
    textAlignVertical: "top",
    paddingTop: 12,
    paddingBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
  },
  tag: {
    backgroundColor: "#0078FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  changeInfoButton: {
    backgroundColor: "#0078FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  changeInfoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
