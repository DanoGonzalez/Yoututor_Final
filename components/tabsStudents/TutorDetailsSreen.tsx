import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTutor } from "../../controllers/usuariosController";
import {
  crearSolicitud,
  verificarSolicitudPendiente,
} from "../../controllers/solicitudesController";
import { Usuario, TutorWithMaterias } from "../../models/usuarios";
import { LinearGradient } from "expo-linear-gradient";
import { TutorDetailsScreenProps } from "../../types";
import { Ionicons } from "@expo/vector-icons";

interface RouteParams {
  tutorId: string;
}

const TutoresDetailsScreen: React.FC<TutorDetailsScreenProps> = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { tutorId } = route.params as RouteParams;
  const [tutor, setTutor] = useState<TutorWithMaterias | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);

  // Manejar solicitud de tutoría
  const handleRequestTutoring = async () => {
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

  // Mostrar indicador de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078FF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Si no se puede cargar la información del tutor
  if (!tutor) {
    return (
      <View style={styles.container}>
        <Text>Error: No se pudo cargar la información del tutor.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#0078FF", "#0066DD"]} style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.profilePictureContainer}>
          <Image
            source={require("../../assets/icons/profile-picture.png")}
            style={styles.profilePicture}
          />
          <Text style={styles.userName}>
            {tutor.nombres} {tutor.apellidos}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email de Contacto</Text>
          <Text style={styles.infoText}>{tutor.correo}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Descripción</Text>
          <Text style={styles.infoText}>{tutor.descripcion}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Materias Dominadas</Text>
          <View style={styles.materiasList}>
            {tutor.materiasDominadas && tutor.materiasDominadas.length > 0 ? (
              tutor.materiasDominadas.map((materia, index) => (
                <Text key={index} style={styles.infoText}>
                  {materia.materia} {/* Si cada materia tiene un nombre */}
                </Text>
              ))
            ) : (
              <Text style={styles.infoText}>No hay materias dominadas.</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.requestTutoringButton,
            isRequested && styles.disabledButton,
          ]}
          onPress={handleRequestTutoring}
          disabled={isRequested}>
          <Text style={styles.requestTutoringButtonText}>
            {isRequested ? "Solicitud Enviada" : "Solicitar Tutoría"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginTop: 10,
  },
  header: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
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
    paddingBottom: 20,
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
  infoText: {
    fontSize: 16,
    color: "#000000",
  },
  requestTutoringButton: {
    backgroundColor: "#0078FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  requestTutoringButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  materiasList: {
    marginTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
});

export default TutoresDetailsScreen;
