import React from "react";
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

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

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
            <TextInput
              style={styles.infoInput}
              defaultValue="John Doe"
              placeholderTextColor="#000000"
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Correo electrónico de contacto</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue="johndoe@example.com"
              placeholderTextColor="#000000"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Intereses</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue="Matemáticas, Física, Programación"
              placeholderTextColor="#000000"
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Método de aprendizaje</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue="Visual, Práctico"
              placeholderTextColor="#000000"
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Plataformas a preferir</Text>
            <TextInput
              style={styles.infoInput}
              defaultValue="Zoom, Google Meet"
              placeholderTextColor="#000000"
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
  header: {
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60,
  },
  profilePictureContainer: {
    position: "absolute",
    bottom: -50,
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
    marginTop: 60,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  infoInput: {
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    height: 40,
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
