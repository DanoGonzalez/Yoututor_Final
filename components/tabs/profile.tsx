import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface ProfileScreenProps {
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
      const usuario = await AsyncStorage.getItem("usuario");
      console.log("Valor de usuario después de eliminar:", usuario); // Debería ser null
      onLogout();
      navigation.navigate("Login" as never);
    } catch (error) {
      console.error("Error al eliminar el usuario de AsyncStorage:", error);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={require("../../assets/icons/profile-picture.png")}
              style={styles.profilePicture}
            />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <Text style={styles.infoValue}>John Doe</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Correo electrónico de contacto</Text>
            <Text style={styles.infoValue}>johndoe@example.com</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Intereses</Text>
            <Text style={styles.infoValue}>Matemáticas, Física, Programación</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Método de aprendizaje</Text>
            <Text style={styles.infoValue}>Visual, Práctico</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Plataformas a preferir</Text>
            <Text style={styles.infoValue}>Zoom, Google Meet</Text>
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
  header: {
    backgroundColor: "#0078FF",
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60, // Ajusta este valor según sea necesario
  },
  profilePictureContainer: {
    position: "absolute",
    bottom: -50, // Ajusta este valor para posicionar la imagen
    alignSelf: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    marginTop: 60, // Espacio para la imagen de perfil
  },
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 5,
  },
  changeInfoButton: {
    backgroundColor: "#0078FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  changeInfoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
