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
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreenNavigationProp, ProfileScreenProps } from "../../types";
import { getUsuario } from "../../controllers/usuariosController"; // Asegúrate de importar correctamente
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import {
  saveUserImage,
  getUserImage,
  updateUsuario,
} from "../../controllers/usuariosController";
import { defaultProfilePictures } from "../../constants/profilePictures";

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [usuario, setUsuario] = useState<any>(null); // Cambiar `any` por tu tipo de usuario si tienes uno
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
      const usuario = await AsyncStorage.getItem("usuario");
      onLogout();
    } catch (error) {
      console.error("Error al eliminar el usuario de AsyncStorage:", error);
    }
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
      console.log("Obteniendo datos del usuario...");
      const usuarioData = await AsyncStorage.getItem("usuario");
      console.log("Datos del usuario:", usuarioData);
      if (usuarioData) {
        const usuario = JSON.parse(usuarioData);
        console.log("Usuario obtenido:", usuario);

        const data = await getUsuario(usuario.id);
        console.log("Datos del usuario:", data);
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

  useEffect(() => {
    loadUserData();
  }, []);

  const selectProfilePicture = async (imagePath: string) => {
    try {
      if (usuario?.id) {
        await updateUsuario(usuario.id, { profilePicture: imagePath });
        setProfileImage(imagePath);
        setShowGallery(false);
      }
    } catch (error) {
      console.error("Error al guardar la imagen de perfil:", error);
    }
  };

  const ProfileGallery = () => (
    <Modal
      visible={showGallery}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowGallery(false)}>
      <View style={styles.galleryModal}>
        <View style={styles.galleryContent}>
          <Text style={styles.galleryTitle}>Selecciona una imagen de perfil</Text>
          <ScrollView 
            style={styles.galleryScrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.galleryGrid}>
              {defaultProfilePictures.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.galleryItem}
                  onPress={() => selectProfilePicture(`profilePicture${index + 1}`)}>
                  <Image 
                    source={image} 
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeGalleryButton}
            onPress={() => setShowGallery(false)}>
            <Text style={styles.closeGalleryButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient colors={["#0078FF", "#0066DD"]} style={styles.header}>
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity
              onPress={() => setShowGallery(true)}
              style={styles.profileImageContainer}>
              <Image
                source={
                  profileImage
                    ? defaultProfilePictures[
                        parseInt(profileImage.replace("profilePicture", "")) - 1
                      ]
                    : require("../../assets/icons/profile-picture.png")
                }
                style={styles.profilePicture}
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setShowGallery(true)}>
                <Image
                  source={require("../../assets/icons/editProfile.png")}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </TouchableOpacity>
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
      <ProfileGallery />
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
  profileImageContainer: {
    position: "relative",
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  scrollViewContent: {
    paddingBottom: 80, // Añade espacio suficiente para la barra de navegación
  },
  galleryModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  galleryContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%', // Limita la altura máxima
    paddingVertical: 20,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  galleryScrollView: {
    maxHeight: '75%', // Asegura que haya espacio para el botón de cerrar
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  galleryItem: {
    width: '30%', // Aproximadamente 3 imágenes por fila
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  closeGalleryButton: {
    backgroundColor: '#0078FF',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  closeGalleryButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;
