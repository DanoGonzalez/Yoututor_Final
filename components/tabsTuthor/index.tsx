import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { TutorStackParamList } from "../../types";
import { db } from "../../utils/Firebase";
import { onSnapshot, query, where, collection } from "firebase/firestore";
import { getUsuario } from "../../controllers/usuariosController";
import { getMateria } from "../../controllers/materiasController";

interface TutorItem {
  id: string;
  subject: string;
  category: string;
  tutor: string;
  color: string;
}

const HomeScreenTutor = () => {
  const navigation = useNavigation<StackNavigationProp<TutorStackParamList>>();
  const [tutorName, setTutorName] = useState<string>("");
  const [materiasDominadas, setMateriasDominadas] = useState<string[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
  const [students, setStudents] = useState<TutorItem[]>([]);

  const handleNotificationsPress = () => {
    setHasUnreadNotifications(false);
    navigation.navigate("NotificacionesScreen");
  };

  const handleCardPress = (id: string) => {
    navigation.navigate("TutoriaDetails", { tutoriaId: id });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const usuarioData = await AsyncStorage.getItem("usuario");
      const usuario = usuarioData ? JSON.parse(usuarioData) : null;

      if (usuario) {
        const data = await getUsuario(usuario.id);
        const materias = await Promise.all(data.materiasDominadas.map(async (materiaId: string) => await getMateria(materiaId)));
        data.materiasDominadas = materias.map((materia: any) => materia.materia);
        setTutorName(data.nombres);
        setMateriasDominadas(data.materiasDominadas);

        const studentsQuery = query(
          collection(db, "tutorias"),
          where("tutorId", "==", usuario.id)
        );
        const unsubscribeStudents = onSnapshot(studentsQuery, (querySnapshot) => {
          const studentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            subject: doc.data().materiaNombre,
            category: doc.data().categoria,
            tutor: doc.data().estudianteNombre,
            color: "#0078FF",
          }));
          setStudents(studentsData);
        });

        const notificacionesQuery = query(
          collection(db, "notificaciones"),
          where("receptorId", "==", usuario.id)
        );
        const unsubscribeNotificaciones = onSnapshot(notificacionesQuery, (querySnapshot) => {
          const hasUnread = querySnapshot.docs.some((doc) => !doc.data().leido);
          setHasUnreadNotifications(hasUnread);
        });

        return () => {
          unsubscribeStudents();
          unsubscribeNotificaciones();
        };
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.welcomeHeader}>
            <Image source={require("../../assets/icons/Ellipse 1.png")} style={styles.profilePicture} />
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.studentName}>Bienvenido, Tutor</Text>
              <Text style={styles.studentName}>{tutorName}</Text>
            </View>
            <View style={styles.iconsContainer}>
              <TouchableOpacity>
                <Ionicons name="search-outline" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNotificationsPress}>
                <Ionicons name="notifications-outline" size={24} color="#000" style={styles.iconSpacing} />
                {hasUnreadNotifications && <View style={styles.notificationDot} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainAdvisoryContainer}>
            <View style={styles.advisoryContent}>
              <View style={styles.advisoryTitleContainer}>
                <Ionicons name="book-outline" size={16} color="#34A853" />
                <Text style={styles.advisoryTitle}> Asesoría Principal</Text>
              </View>
              <Text style={styles.advisorySubject}>{materiasDominadas.join(", ")}</Text>
              <View style={styles.advisoryButtonsContainer}>
                <TouchableOpacity style={styles.chatButton}>
                  <Text style={styles.chatButtonText}>Ir al chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.scheduleButton}>
                  <Text style={styles.scheduleButtonText}>Ver horarios</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image source={require("../../assets/icons/pana.png")} style={styles.advisoryImageLarge} />
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>Mis Estudiantes</Text>
            {students.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => handleCardPress(item.id)} style={styles.advisoryCard}>
                <Image source={require("../../assets/icons/tutorias.remotas.png")} style={styles.advisoryImageBackground} />
                <View style={styles.advisoryContent}>
                  <Text style={styles.tutorName}>{item.tutor}</Text>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.modeText}>Virtual</Text>
                  </View>
                  <Text style={styles.activeStatus}>Activo</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 10,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginLeft: 15,
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  mainAdvisoryContainer: {
    flexDirection: "row",
    padding: 15,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  advisoryContent: {
    flex: 1,
    padding: 12,
  },
  advisoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  advisoryTitle: {
    fontSize: 12,
    color: "#34A853",
    fontWeight: "bold",
  },
  advisorySubject: {
    fontSize: 14,
    color: "#333",
    marginVertical: 5,
    fontWeight: "600",
  },
  advisoryButtonsContainer: {
    flexDirection: "column",
    marginTop: 5,
  },
  chatButton: {
    backgroundColor: "#0078D4",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 6,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  scheduleButton: {
    borderColor: "#0078D4",
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  scheduleButtonText: {
    color: "#0078D4",
    fontSize: 12,
  },
  advisoryImageLarge: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  content: {
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  subtitle: {
    fontSize: 20,
    color: "#666161",
    marginBottom: 20,
    fontWeight: "bold",
  },
  advisoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 12,
  },
  advisoryImageBackground: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  tutorName: {
    fontSize: 14,
    color: "#666",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modeText: {
    fontSize: 12,
    color: "#666",
  },
  activeStatus: {
    color: "#34A853",
    fontWeight: "bold",
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default HomeScreenTutor;
