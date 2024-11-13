import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import MultiSelect from "react-native-multiple-select";
import * as ImagePicker from "expo-image-picker";
import profileImage from "../assets/Profile/user.jpg";

const technologies = [
  { id: "1", name: "JavaScript" },
  { id: "2", name: "React" },
  { id: "3", name: "Node.js" },
  { id: "4", name: "Python" },
  { id: "5", name: "Django" },
  { id: "6", name: "Ruby" },
  { id: "7", name: "PHP" },
];

export default function EditarPerfilScreen() {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [nombre, setNombre] = useState("John");
  const [apellido, setApellido] = useState("Smith");
  const [correo, setCorreo] = useState("johnsmith@gmail.com");
  const [descripcion, setDescripcion] = useState("Descripción del usuario");
  const [github, setGithub] = useState("www.github.com");
  const [linkedin, setLinkedin] = useState("www.linkedin.com");
  const [profileUri, setProfileUri] = useState<string | null>(null); // Estado para la imagen de perfil seleccionada

  const handleEditPhoto = async () => {
    // Solicitar permisos para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
                <Image source={profileUri ? { uri: profileUri } : profileImage} style={styles.profileImage} />
              </View>
                <TouchableOpacity style={styles.editButton} onPress={handleEditPhoto}>
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
              <Text style={styles.label}>Tecnologías</Text>
              <MultiSelect
                items={technologies}
                uniqueKey="id"
                onSelectedItemsChange={(selectedItems: string[]) =>
                  setSelectedTechnologies(selectedItems)
                }
                selectedItems={selectedTechnologies}
                selectText="Selecciona tecnologías"
                searchInputPlaceholderText="Buscar..."
                tagRemoveIconColor="#0078FF"
                tagBorderColor="#0078FF"
                tagTextColor="#0078FF"
                selectedItemTextColor="#0078FF"
                selectedItemIconColor="#0078FF"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: "#0078FF" }}
                submitButtonColor="#0078FF"
                submitButtonText="Seleccionar"
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
              <TouchableOpacity style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
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
  label: {
    fontSize: 14,
    color: "#545454",
    marginBottom: 5,
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