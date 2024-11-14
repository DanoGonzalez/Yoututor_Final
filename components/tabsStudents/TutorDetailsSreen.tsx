import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import emailIcon from "../../assets/Profile/outlook.png";
import materialIcon from "../../assets/Profile/book.png";
import userImage from "../../assets/TutorDetails/Doctor 1.png";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTutor } from "../../controllers/usuariosController";
import {
  crearSolicitud,
  verificarSolicitudPendiente,
} from "../../controllers/solicitudesController";
import { Usuario, TutorWithMaterias } from "../../models/usuarios";


interface RouteParams {
  tutorId: string;
}
export default function TutorDetailsScreen() {

  const route = useRoute();
  const navigation = useNavigation<any>();
  const { tutorId } = route.params as RouteParams;
  const [tutor, setTutor] = useState<TutorWithMaterias | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);

  // Manejar solicitud de tutoría
  const handleRequestTutoring = async () => {
    console.log("Solicitando tutoría...");
    try {
      const usuario = await AsyncStorage.getItem("usuario");
      if (!usuario) {
        alert("Error: No se pudo obtener la información del usuario");
        return;
      }

      const estudiante = JSON.parse(usuario);
      const estudianteId = estudiante.id;
      const materiaId = tutor?.materiasDominadas[0].id || 0;

      // Verificar si ya existe una solicitud
      const solicitudExistente = await verificarSolicitudPendiente(
        tutorId,
        estudianteId
      );
      if (solicitudExistente) {
        alert("Ya has enviado una solicitud para este tutor.");
        return;
      }

      await crearSolicitud(tutorId, estudianteId, String(materiaId));
      alert("Solicitud enviada con éxito");
      setIsRequested(true);
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
      alert("Error al enviar la solicitud");
    }
  };

  // Función para navegar de regreso a la pantalla de tutores
  const handleBackPress = () => {
    navigation.navigate("Tutores");
  };

  // Función para obtener datos del tutor y verificar solicitud
  useFocusEffect(
    useCallback(() => {
      const fetchTutor = async () => {
        setLoading(true);
        try {
          const data = await getTutor(tutorId);
          // Convertimos las materias dominadas a un arreglo de strings
          const tutorAdaptado: TutorWithMaterias = {
            ...data,
            materiasDominadas: data.materiasDominadas.map((materia) => ({
              id: materia.id,
              materia: materia.materia,
            })), // Extraemos solo los nombres de las materias
          };

          setTutor(tutorAdaptado);
          console.log(tutorAdaptado);

          const usuario = await AsyncStorage.getItem("usuario");
          if (usuario) {
            const estudiante = JSON.parse(usuario);
            const solicitudExistente = await verificarSolicitudPendiente(
              tutorId,
              estudiante.id
            );
            setIsRequested(solicitudExistente);
          }
        } catch (error) {
          console.error("Error al obtener el tutor:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTutor();
    }, [tutorId])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078FF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!tutor) {
    return (
      <View style={styles.container}>
        <Text>Error: No se pudo cargar la información del tutor.</Text>
      </View>
    );
  }

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
              <LinearGradient
                colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0)"]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.diagonalLine, { top: 0 }]}
              />
              <LinearGradient
                colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0)"]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.diagonalLine, { top: 180 }]}
              />
              <LinearGradient
                colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0)"]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.diagonalLine, { top: 360 }]}
              />

              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <MaterialIcons name="arrow-back" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.title}>Solicitar Tutor</Text>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.userImageContainer}>
                <Image source={userImage} style={styles.userImage} />
              </View>
              <Text style={styles.name}>{tutor.nombres} {tutor.apellidos}</Text>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.contactContainer}>
                <View style={styles.contactItemLeft}>
                  <Image source={emailIcon} style={styles.icon} />
                  <Text style={styles.contactText}>{tutor.correo} </Text>
                </View>
                <View style={styles.contactItemRight}>
                  <Image source={materialIcon} style={styles.icon} />
                  <Text style={styles.contactText}>
                  {tutor.materiasDominadas && tutor.materiasDominadas.length > 0 ? (
                      tutor.materiasDominadas.map((materia, index) => (
                        <Text key={index} style={styles.infoText}>
                          {materia.materia}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.infoText}>No hay materias dominadas.</Text>
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {tutor.descripcion || "No hay descripción disponible."}
                </Text>
              </View>
            </View>

            <TouchableOpacity  style={[styles.requestButton, isRequested && styles.requestButtonDisabled]} disabled={isRequested} onPress={handleRequestTutoring}>
              <Text style={styles.requestButtonText}>{isRequested ? "Solicitud Enviada" : "Solicitar Tutoría"}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0078FF",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#0078FF",
    paddingBottom: 400,
    paddingTop: 30,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  diagonalLine: {
    position: "absolute",
    left: -140,
    right: -250,
    height: 70,
    transform: [{ rotate: "320deg" }],
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
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
    alignItems: "center",
    marginTop: -45,
    position: "relative",
  },
  userImageContainer: {
    position: "absolute",
    top: -316,
    width: 260,
    height: 320,
    overflow: "hidden",
    borderColor: "#fff",
  },
  userImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#545454",
    marginTop: 30,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  contactItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    color: "#545454",
    marginLeft: 10,
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#545454",
    marginBottom: 10,
  },
  requestButton: {
    backgroundColor: "#0078FF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    left: "10%",
    right: "10%",
    alignItems: "center",
  },
  requestButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  requestButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    color: "#545454",
    fontSize: 14,
  },
});
