import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import profileImage from "../assets/Profile/User1.jpg";
import emailIcon from "../assets/Profile/outlook.png";
import materialIcon from "../assets/Profile/book.png";
import jsIcon from "../assets/Profile/js.png";
import reactIcon from "../assets/Profile/react.png";
import githubIcon from "../assets/Profile/github.png";
import { updateUsuario, getUsuario } from "../controllers/usuariosController";
import { ProfileScreenNavigationProp, ProfileScreenProps } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getMateria } from "../controllers/materiasController";
import ProfileNotFoundModal from "./Modals/ProfileNotFoundModal";

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showProfileNotFoundModal, setShowProfileNotFoundModal] = useState(false);

  const handleOpenUrl = (
    url: string | undefined,
    platform: "github" | "linkedin"
  ) => {
    if (url) {
      // Si la URL es completa
      if (url.startsWith("http")) {
        Linking.openURL(url);
      } else {
        // Si solo es el nombre de usuario
        const baseUrl =
          platform === "github"
            ? "https://github.com/"
            : "https://linkedin.com/in/";
        Linking.openURL(baseUrl + url);
      }
    } else {
      setShowProfileNotFoundModal(true);
    }
  };

  const handleLogout = () => {
    onLogout();
    console.log("Cerrando sesión");
  };

  const handleEdit = () => {
    console.log("Editando perfil...");
    navigation.navigate("EditProfile");
  };

  const loadProfileImage = async (userId: string) => {
    try {
      const userData = await getUsuario(userId);
      if (userData?.profilePicture) {
        setProfileImage(userData.profilePicture);
      }
    } catch (error) {
      console.error("Error al cargar la imagen del perfil:", error);
    }
  };

  const loadUserData = async () => {
    console.log("Cargando datos del usuario...");
    try {
      const usuarioData = await AsyncStorage.getItem("usuario");
      console.log("Usuario:", usuarioData);
      if (usuarioData) {
        console.log("Usuario encontrado en AsyncStorage.");
        const usuario = JSON.parse(usuarioData);
        const data = await getUsuario(usuario.id);
        if (data.role != 1) {
          const materias = await Promise.all(
            data.materiasDominadas.map(
              async (materiaId: string) => await getMateria(materiaId)
            )
          );
          data.materiasDominadas = materias.map((materia: any) => materia.materia);
        }
        setUsuario(data);

        await loadProfileImage(usuario.id);
      } else {
        console.log("No se encontró el usuario en AsyncStorage.");
      }
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  useEffect(() => {
    loadUserData();
  }, []);

  const handleCloseProfileNotFoundModal = () => {
    setShowProfileNotFoundModal(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078FF" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontró información del usuario.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <FlatList
        data={[]}
        keyExtractor={() => "key"}
        renderItem={() => null}
        contentContainerStyle={{ backgroundColor: "white", flexGrow: 1 }}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Perfil</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.editButtonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                  <MaterialIcons name="edit" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileImageContainer}>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require("../assets/Profile/User1.jpg")
                  }
                  style={styles.profileImage}
                />
              </View>
              <Text
                style={
                  styles.name
                }>{`${usuario.nombres} ${usuario.apellidos}`}</Text>
              <Text style={styles.role}>
                {usuario.role === 1
                  ? "Admin"
                  : usuario.role === 2
                  ? "Estudiante"
                  : usuario.role === 3
                  ? "Tutor"
                  : "Desconocido"}
              </Text>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.contactContainer}>
                <View style={styles.contactItemLeft}>
                  <Image source={emailIcon} style={styles.icon} />
                  <Text style={styles.contactText}>{usuario.correo} </Text>
                </View>
                <View style={styles.contactItemRight}>
                  <Image source={materialIcon} style={styles.icon} />

                  <Text style={styles.contactText}>
                    {usuario.materiasDominadas
                      ? usuario.materiasDominadas.join(", ")
                      : "Sin materias"}
                  </Text>
                </View>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.descriptionText}>
                  {usuario.descripcion ? usuario.descripcion : "Sin descripción"}
                </Text>
              </View>

              <View style={styles.technologiesContainer}>
                <Text style={styles.sectionTitle}>Tecnologías</Text>
                <View style={styles.technologyIcons}>
                  <Image
                    source={jsIcon}
                    style={[styles.icon, { width: 40, height: 40 }]}
                  />
                  <Image
                    source={reactIcon}
                    style={[styles.icon, { width: 40, height: 40 }]}
                  />
                  <Image
                    source={githubIcon}
                    style={[styles.icon, { width: 40, height: 40 }]}
                  />
                </View>
              </View>

              {/* Iconos de GitHub y LinkedIn como botones al final */}
              <Text style={styles.sectionTitle}>Redes</Text>
              <View style={styles.socialIconsContainer}>
                <TouchableOpacity
                  onPress={() => handleOpenUrl(usuario.githubProfile, "github")}>
                  <FontAwesome name="github" size={40} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleOpenUrl(usuario.linkedinProfile, "linkedin")
                  }>
                  <FontAwesome name="linkedin-square" size={40} color="#0078FF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
      <ProfileNotFoundModal
        visible={showProfileNotFoundModal}
        onClose={handleCloseProfileNotFoundModal}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#0078FF",
    paddingBottom: 110,
    paddingTop: 35,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    padding: 5,
    right: 10,
    top: 28,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  technologyIcons: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginTop: 1,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 60,
    alignItems: "center",
    marginTop: -45,
    position: "relative",
  },
  editButtonContainer: {
    position: "absolute",
    top: 14,
    right: 14,
  },
  editButton: {
    backgroundColor: "#0078FF",
    borderRadius: 30,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  profileImageContainer: {
    position: "absolute",
    top: -50,
    width: 130,
    height: 130,
    borderRadius: 90,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "regular",
    color: "#545454",
    marginTop: 30,
  },
  role: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#545454",
  },
  contentContainer: {
    paddingHorizontal: 30,
    flex: 1, // Permite que el contenedor crezca y ocupe todo el espacio disponible
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginVertical: 20,
  },
  contactItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactItemRight: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap", // Evita que los elementos se envuelvan
    maxWidth: "80%", // Limita el ancho
  },

  contactText: {
    color: "#545454",
    marginLeft: 10,
    fontSize: 14,
    maxWidth: "80%", // Ajusta el ancho disponible para el texto
    overflow: "hidden", // Esconde el texto desbordado
  },

  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#545454",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#545454",
    marginBottom: 10,
  },
  technologiesContainer: {
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
    marginBottom: 30,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default ProfileScreen;
