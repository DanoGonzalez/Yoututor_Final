import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { TutorStackParamList } from "../../types";
import { db } from "../../utils/Firebase";
import { onSnapshot, query, where, collection } from "firebase/firestore";
import { getUsuario } from "../../controllers/usuariosController";

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
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
  const [students, setStudents] = useState<TutorItem[]>([]);

  const handleNotificationsPress = () => {
    setHasUnreadNotifications(false);
    navigation.navigate("NotificacionesScreen");
  };

  // const handleTutoresPress = () => {
  //   navigation.navigate("Tutores");
  // };

  const handleSchedulePress = () => {
    navigation.navigate("ScheduleConsulting");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const usuarioData = await AsyncStorage.getItem("usuario");
      const usuario = usuarioData ? JSON.parse(usuarioData) : null;

      if (usuario) {
        const data = await getUsuario(usuario.id);
        setTutorName(data.nombres);

        // Listener en tiempo real para los estudiantes
        const studentsQuery = query(
          collection(db, "students"),
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

        // Listener en tiempo real para las notificaciones
        const notificacionesQuery = query(
          collection(db, "notificaciones"),
          where("receptorId", "==", usuario.id)
        );
        const unsubscribeNotificaciones = onSnapshot(notificacionesQuery, (querySnapshot) => {
          const hasUnread = querySnapshot.docs.some((doc) => !doc.data().leido);
          setHasUnreadNotifications(hasUnread);
        });

        // Limpieza de los listeners al desmontar el componente
        return () => {
          unsubscribeStudents();
          unsubscribeNotificaciones();
        };
      }
    };

    fetchUserData();
  }, []);

  const renderItem = ({ item }: { item: TutorItem }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.subject}>{item.subject}</Text>
        <TouchableOpacity>
          <Image source={require("../../assets/icons/twoPoints.png")} style={styles.moreIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.category}>{item.category}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.tutorInfo}>
          <Image source={require("../../assets/icons/genericProfile.png")} style={styles.profileIcon} />
          <Text style={styles.tutor}>{item.tutor}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={18} color="#0078FF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Encabezado de Bienvenida */}
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
            <Text style={styles.advisorySubject}>Diseño y Arquitectura del Software</Text>
            <View style={styles.advisoryButtonsContainer}>
              <TouchableOpacity 
              // onPress={handleChatPress}
              style={styles.chatButton}>
                <Text style={styles.chatButtonText}>Ir al chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.scheduleButton}>
                <Text style={styles.scheduleButtonText}>Ver horarios</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Image
            source={require("../../assets/icons/pana.png")}
            style={styles.advisoryImage}
          />
        </View>

        {/* Botón para Agendar Asesoría */}
        {/* <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedulePress}>
          <Text style={styles.scheduleButtonText}>Agendar Asesoría</Text>
        </TouchableOpacity> */}

        {/* Lista de Estudiantes */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>Mis Estudiantes</Text>
          <FlatList
            data={students}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  iconSpacing: {
    marginLeft: 15,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatButton: {
    backgroundColor: "#0078D4",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 8,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  advisoryImage: {
    width: 150,
    height: 120,
    resizeMode: "contain",
    marginLeft: 17,
    transform: [{ scale: 1.2 }],
  },
  advisoryButtonsContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  advisorySubject: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    fontWeight: "600",
  },
  advisoryTitle: {
    fontSize: 12,
    color: "#34A853",
    fontWeight: "bold",
  },
  advisoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  advisoryContent: {
    flex: 1,
    padding: 12,
  },
  mainAdvisoryContainer: {
    flexDirection: "row",
    padding: 15,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
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
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  scheduleButton: {
    borderColor: "#0078D4",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  scheduleButtonText: {
    color: "#0078D4",
    fontSize: 13,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  subtitle: {
    fontSize: 20,
    color: "#666161",
    marginBottom: 20,
    fontWeight: "bold",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  category: {
    fontSize: 14,
    color: "#FFFFFF",
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tutorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  tutor: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 6,
  },
});

export default HomeScreenTutor;
