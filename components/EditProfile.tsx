import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import profileImage from "../assets/Profile/User.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from "../models/usuarios";
import { getUsuario, updateUsuario } from "../controllers/usuariosController";
import { getMateria } from "../controllers/materiasController";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { EditProfileScreenProps } from "../types";
import SuccessEditProfile from "./Modals/SuccessEditProfileModal";
import ErrorEditProfileModal from "./Modals/ErrorEditProfileModal";

export default function EditarPerfilScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [profileUri, setProfileUri] = useState<string | null>(null); // Estado para la imagen de perfil seleccionada
  const [usuario, setUsuario] = useState<Usuario | null>(null); // Estado para el usuario
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleEditPhoto = async () => {
    // Solicitar permisos para acceder a la galería
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permiso para acceder a la galería es necesario.");
      return;
    }

    // Abrir la galería de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Si el usuario selecciona una imagen, actualizamos el estado
    if (!result.canceled) {
      setProfileUri(result.assets[0].uri);
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
        if (data.role !== 1) {
          const materias = await Promise.all(
            data.materiasDominadas.map(
              async (materiaId: string) => await getMateria(materiaId)
            )
          );
          data.materiasDominadas = materias.map((materia: any) => materia.materia);
        }
        setUsuario(data);
        console.log("Datos del usuario cargados para editar:", data);

        // Establecer los datos en los campos del formulario
        setNombre(data.nombres);
        setApellido(data.apellidos);
        setCorreo(data.correo);
        setDescripcion(data.descripcion || "");
        setGithub(data.githubProfile || "");
        setLinkedin(data.linkedinProfile || "");
        setSelectedTechnologies(data.tecnologias || []);
      } else {
        console.log("No se encontró el usuario en AsyncStorage.");
      }
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!usuario) return;

    const updatedData: Partial<Usuario> = {
      nombres: nombre,
      apellidos: apellido,
      correo: correo,
      descripcion: descripcion,
      githubProfile: github,
      linkedinProfile: linkedin,
      tecnologias: selectedTechnologies,
    };

    try {
      if (usuario.id) {
        await updateUsuario(usuario.id, updatedData);
        setShowSuccessModal(true);
        console.log("Usuario actualizado:");
        navigation.goBack();
      } else {
        console.error("Usuario ID is undefined");
      }
    } catch (error) {
      setShowErrorModal(true);
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <FlatList
        data={[]}
        keyExtractor={() => "key"}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.title}>Editar Perfil</Text>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={profileUri ? { uri: profileUri } : profileImage}
                  style={styles.profileImage}
                />
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditPhoto}>
                <MaterialIcons name="edit" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
              <TextInput
                label="Nombre(s)"
                style={styles.input}
                value={nombre}
                onChangeText={(text) => setNombre(text)}
                mode="outlined"
              />

              <TextInput
                label="Apellidos"
                style={styles.input}
                value={apellido}
                onChangeText={(text) => setApellido(text)}
                mode="outlined"
              />

              <TextInput
                label="Correo"
                style={styles.input}
                value={correo}
                onChangeText={(text) => setCorreo(text)}
                mode="outlined"
              />

              <TextInput
                label="Descripción"
                style={[styles.input, styles.descriptionInput]}
                value={descripcion}
                onChangeText={(text) => setDescripcion(text)}
                mode="outlined"
                multiline
              />

              <TextInput
                label="Github"
                style={styles.input}
                value={github}
                onChangeText={(text) => setGithub(text)}
                mode="outlined"
              />

              <TextInput
                label="LinkedIn"
                style={styles.input}
                value={linkedin}
                onChangeText={(text) => setLinkedin(text)}
                mode="outlined"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdate}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      <SuccessEditProfile
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <ErrorEditProfileModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#0078FF",
    paddingBottom: 110,
    paddingTop: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 30,
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
  profileImageContainer: {
    position: "absolute",
    top: -50,
    width: 130,
    height: 130,
    borderRadius: 90,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  editButton: {
    position: "absolute",
    bottom: -10,
    right: 150,
    backgroundColor: "#0078FF",
    borderRadius: 20,
    padding: 5,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
  },
  descriptionInput: {
    marginTop: 10,
    height: 80,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  saveButton: {
    backgroundColor: "#0078FF",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
