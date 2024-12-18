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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTutoriasbyid, updateTutoria } from "../controllers/tutoriasController";
import SuccessAsesoriaModal from "./Modals/SuccessAsesoriaModal";
import CanceledAsesoriaModal from "./Modals/CanceledAsesoriaModal";
import ModalTutoriaDetails from "./Modals/ModalTutoriaDetails";

const TutoriaDetails: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCanceledModal, setShowCanceledModal] = useState(false);
  const [showNoLinkModal, setShowNoLinkModal] = useState(false);

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
      horario: tutoria.horario,
      modalidad: "Virtual",
      plataforma: tutoria.plataforma || "Discord",
      descripcion: tutoria.descripcion || "",
      enlaceAsesoria: tutoria.enlaceAsesoria || "",
    });
    setIsEditing(false);
  };

  const handleCancelarAsesoria = async () => {
    try {
      const updatedTutoria = {
        status: 0,
      };
      await updateTutoria(tutoriaId, updatedTutoria);
      setTutoria({ ...tutoria, ...updatedTutoria });
      setShowCanceledModal(true);
    } catch (error) {
      console.error("Error al cancelar la tutoría:", error);
    }
  };

  const handleStartAsesoria = () => {
    if (tutoria.enlaceAsesoria) {
      let url = tutoria.enlaceAsesoria.trim();
      
      // Asegurarse de que el enlace tiene un esquema válido (http o https)
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }
  
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            throw new Error("El enlace proporcionado no es válido");
          }
        })
        .then(() => {
          setShowSuccessModal(true);
        })
        .catch((err) => {
          console.error("Failed to open URL:", err);
          Alert.alert(
            "Error",
            "No se pudo abrir el enlace de la asesoría. Asegúrate de que el enlace es válido."
          );
        });
    } else {
      setShowNoLinkModal(true);
    }
  };
  

  useEffect(() => {
    fetchTutoriadetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078FF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const isTutor = userRole === 3;
  const profileName = isTutor
    ? tutoria.estudianteData.nombres
    : tutoria.tutorData.nombres;
  const profileRole = isTutor ? "Estudiante" : "Tutor";
  const profilePicture = isTutor
    ? tutoria.estudianteData?.profilePicture ||
      "../assets/icons/profile-picture.png"
    : tutoria.tutorData?.profilePicture || "../assets/icons/profile-picture.png";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftSection}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{tutoria.materiaNombre} </Text>
        </View>

        <Image
          source={require("../assets/icons/POO.jpg")}
          style={styles.backgroundImage}
        />

        <View style={styles.tutorContainer}>
          {isTutor && !isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={24} color="#000" />
            </TouchableOpacity>
          )}

          <View style={styles.tutorProfileAndDetails}>
            <View style={styles.tutorProfileContainer}>
              <Image source={profilePicture} style={styles.profileImageLarge} />
              <View style={styles.tutorInfo}>
                <Text
                  style={styles.tutorName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
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
                    value={editableData.plataforma}
                    onChangeText={(text) =>
                      setEditableData({ ...editableData, plataforma: text })
                    }
                    placeholder="Plataforma"
                  />
                </View>
              ) : (
                <View>
                  <View style={styles.detailItemContainerSmaller}>
                    <Text style={styles.detailLabelSmaller}>Modalidad:</Text>
                    <Text style={styles.detailValueSmaller}>Virtual</Text>
                  </View>
                  <View style={styles.detailItemContainerSmaller}>
                    <Text style={styles.detailLabelSmaller}>Plataforma:</Text>
                    <Text style={styles.detailValueSmaller}>
                      {tutoria.plataforma}
                    </Text>
                  </View>
                </View>
              )}
              <Text style={styles.statusActive}>Activo</Text>
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
                onChangeText={(text) =>
                  setEditableData({ ...editableData, enlaceAsesoria: text })
                }
                placeholder="Ingrese el enlace de la asesoría"
              />
            </View>
          </View>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción de la Asesoría</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={editableData.descripcion}
              onChangeText={(text) =>
                setEditableData({ ...editableData, descripcion: text })
              }
              placeholder="Agrega una descripción..."
              multiline={true}
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
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartAsesoria}
            >
              <Text style={styles.startButtonText}>Iniciar Asesoría</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <SuccessAsesoriaModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <CanceledAsesoriaModal
        visible={showCanceledModal}
        onClose={() => setShowCanceledModal(false)}
      />
      <ModalTutoriaDetails
        visible={showNoLinkModal}
        onClose={() => setShowNoLinkModal(false)}
      />
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
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 20,
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
    maxWidth: 120,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#0078FF",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#0078D4",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderColor: "#0078D4",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  cancelButtonText: {
    color: "#0078D4",
    fontSize: 16,
    fontWeight: "600",
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
    height: 100,
    textAlignVertical: "top",
  },
  linkInputContainer: {
    width: "90%",
    marginTop: 10,
  },
});

export default TutoriaDetails;
