import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTutoriasbyid, updateTutoria } from "../controllers/tutoriasController";

const TutoriaDetails: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { tutoriaId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [tutoria, setTutoria] = useState<any>({});
  const [userRole, setUserRole] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    horario: "",
    modalidad: "",
    plataforma: "",
    descripcion: "",
    enlaceAsesoria: "",
  });

  const fetchTutoriadetails = async () => {
    try {
      const userlogged = await AsyncStorage.getItem("usuario");
      const role = userlogged ? JSON.parse(userlogged).role : null;
      setUserRole(role);
      const fetchtutoria = await getTutoriasbyid(tutoriaId);
      console.log("Tutoria:", fetchtutoria);
      setTutoria(fetchtutoria);
      setEditableData({
        horario: fetchtutoria.horario || "",
        modalidad: "Virtual",
        plataforma: fetchtutoria.plataforma || "Discord",
        descripcion: fetchtutoria.descripcion || "",
        enlaceAsesoria: fetchtutoria.enlaceAsesoria || "",
      });
    } catch (error) {
      console.error("Error al obtener los detalles de la tutoría:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedTutoria = {
        horario: editableData.horario,
        plataforma: editableData.plataforma,
        descripcion: editableData.descripcion,
        enlaceAsesoria: editableData.enlaceAsesoria,
      };
      await updateTutoria(tutoriaId, updatedTutoria);
      setTutoria({ ...tutoria, ...updatedTutoria });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la tutoría:", error);
    }
  };

  const handleCancel = () => {
    setEditableData({
      horario: tutoria.horario || "",
      modalidad: "Virtual",
      plataforma: tutoria.plataforma || "Discord",
      descripcion: tutoria.descripcion || "",
      enlaceAsesoria: tutoria.enlaceAsesoria || "",
    });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchTutoriadetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const isTutor = userRole === 3;
  const profileName = isTutor ? tutoria.estudianteData.nombres : tutoria.tutorData.nombres;
  const profileRole = isTutor ? "Estudiante" : "Tutor";
  const profilePicture = isTutor
    ? tutoria.estudianteData?.profilePicture || "../assets/icons/profile-picture.png"
    : tutoria.tutorData?.profilePicture || "../assets/icons/profile-picture.png";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftSection}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{tutoria.materiaNombre} </Text>
        </View>

        <Image source={require("../assets/icons/POO.jpg")} style={styles.backgroundImage} />

        <View style={styles.tutorContainer}>
          <View style={styles.tutorProfileAndDetails}>
            <View style={styles.tutorProfileContainer}>
              <Image source={profilePicture} style={styles.profileImageLarge} />
              <View style={styles.tutorInfo}>
                <Text style={styles.tutorName} numberOfLines={1} ellipsizeMode="tail">
                  {profileName}
                </Text>
                <Text style={styles.tutorRole}>{profileRole}</Text>
              </View>
            </View>

            <View style={styles.detailsContainerSmaller}>
              {isEditing ? (
                <View>
                  <TextInput
                    style={styles.input}
                    value={editableData.horario}
                    onChangeText={(text) => setEditableData({ ...editableData, horario: text })}
                    placeholder="Horario"
                  />
                  <TextInput
                    style={styles.input}
                    value={editableData.modalidad}
                    onChangeText={(text) => setEditableData({ ...editableData, modalidad: text })}
                    placeholder="Modalidad"
                  />
                  <TextInput
                    style={styles.input}
                    value={editableData.plataforma}
                    onChangeText={(text) => setEditableData({ ...editableData, plataforma: text })}
                    placeholder="Plataforma"
                  />
                </View>
              ) : (
                <View>
                  <View style={styles.detailItemContainerSmaller}>
                    <Text style={styles.detailLabelSmaller}>Horario:</Text>
                    <Text style={styles.detailValueSmaller}>{tutoria.horario}</Text>
                  </View>
                  <View style={styles.detailItemContainerSmaller}>
                    <Text style={styles.detailLabelSmaller}>Modalidad:</Text>
                    <Text style={styles.detailValueSmaller}>Virtual</Text>
                  </View>
                  <View style={styles.detailItemContainerSmaller}>
                    <Text style={styles.detailLabelSmaller}>Plataforma:</Text>
                    <Text style={styles.detailValueSmaller}>{tutoria.plataforma}</Text>
                  </View>
                </View>
              )}
              <Text style={styles.statusActive}>Activo</Text>
              {isTutor && (
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Ionicons name={isEditing ? "save" : "pencil"} size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {isEditing && (
        <View style={styles.descriptionContainer}>
            <View style={styles.linkInputContainer}>
                <Text style={styles.inputLabel}>Enlace de la Asesoría:</Text>
                <TextInput
                style={styles.input}
                value={editableData.enlaceAsesoria}
                onChangeText={(text) => setEditableData({ ...editableData, enlaceAsesoria: text })}
                placeholder="Ingrese el enlace de la asesoría"
                />
            </View>
        </View>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción de la Asesoría</Text>
          {isEditing ? (
            <TextInput
                style={[styles.input, styles.multilineInput]} // Estilo adicional para múltiples líneas
                value={editableData.descripcion}
                onChangeText={(text) => setEditableData({ ...editableData, descripcion: text })}
                placeholder="Agrega una descripción..."
                multiline={true} // Permitir múltiples líneas
            />
            ) : (
            <Text style={styles.descriptionText}>
                {tutoria.descripcion || "Sin descripción disponible."}
            </Text>
            )}

        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.startButton} onPress={handleSave}>
                <Text style={styles.startButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancelar Cambios</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  if (tutoria.enlaceAsesoria) {
                    Linking.openURL(tutoria.enlaceAsesoria).catch(err =>
                      console.error("Failed to open URL:", err)
                    );
                  } else {
                    alert("No hay un enlace disponible para esta tutoría.");
                  }
                }}
              >
                <Text style={styles.startButtonText}>Iniciar Asesoría</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar Asesoría</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    width: "100%",
  },
  leftSection: {
    padding: 10,
  },
  backgroundImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
  },
  tutorContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 20,
  },
  tutorProfileAndDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tutorProfileContainer: {
    alignItems: "center",
    flexShrink: 1,
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  tutorInfo: {
    alignItems: "center",
    maxWidth: 120, // Limit the width to avoid overflow issues
  },
  tutorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flexShrink: 1,
  },
  tutorRole: {
    fontSize: 14,
    color: "#888",
  },
  detailsContainerSmaller: {
    flex: 1,
    paddingLeft: 50,
  },
  detailItemContainerSmaller: {
    marginBottom: 8,
  },
  detailLabelSmaller: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  detailValueSmaller: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  statusActive: {
    fontSize: 14,
    color: "#34A853",
    fontWeight: "bold",
    marginTop: 5,
  },
  descriptionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "90%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 20,
    width: "90%",
    justifyContent: "center",
    alignItems: 'center',  // Centrar los botones horizontalmente
  },
  startButton: {
    backgroundColor: "#0078D4",
    paddingVertical: 15,  // Ajuste del padding para que coincida con Figma
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 16,  // Aumentar el tamaño de la fuente del botón
    fontWeight: '600',  // Añadir grosor al texto para más visibilidad
  },
  cancelButton: {
    borderColor: "#0078D4",
    borderWidth: 1,
    paddingVertical: 15,  // Ajuste del padding para que coincida con Figma
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  cancelButtonText: {
    color: "#0078D4",
    fontSize: 16,  // Aumentar el tamaño de la fuente del botón
    fontWeight: '600',  // Añadir grosor al texto para más visibilidad
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },
  multilineInput: {
    height: 100, // Adjust the height as needed
    textAlignVertical: 'top', // Align text to the top
  },
  linkInputContainer: {
    width: "90%",
    marginTop: 10,
  },
});

export default TutoriaDetails;
