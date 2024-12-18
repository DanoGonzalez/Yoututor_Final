import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onSnapshot, query, where, collection } from "firebase/firestore";
import { db } from "../../utils/Firebase";
import { getUsuario } from "../../controllers/usuariosController";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

interface TutorItem {
  id: string;
  subject: string;
  category: string;
  tutor: string;
  color: string;
}

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [tutorias, setTutorias] = useState<TutorItem[]>([]);
  const [studentName, setStudentName] = useState<string>("");
  const [hasUnreadNotifications, setHasUnreadNotifications] =
    useState<boolean>(false);

  const handleTutoresPress = () => {
    navigation.navigate("Tutores");
  };

  const handleChatPress = () => {
    navigation.navigate("Messages");
  };
  const handleCardPress = (id: string) => {
    console.log("Tutoria ID:", id);
    navigation.navigate("TutoriaDetails", { tutoriaId: id });
  };

  const handleNotificationsPress = () => {
    setHasUnreadNotifications(false);
    navigation.navigate("NotificacionesScreen");
  };

  const fetchUserData = async () => {
    const usuarioData = await AsyncStorage.getItem("usuario");
    const usuario = usuarioData ? JSON.parse(usuarioData) : null;

    if (usuario) {
      const data = await getUsuario(usuario.id);
      setStudentName(data.nombres);

      const tutoriasQuery = query(
        collection(db, "tutorias"),
        where("estudianteId", "==", usuario.id),
        where("status", "==", 1)
      );
      const unsubscribeTutorias = onSnapshot(tutoriasQuery, (querySnapshot) => {
        const tutoriasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          subject: doc.data().materiaNombre,
          category: doc.data().estudianteNombre,
          tutor: doc.data().tutorNombre,
          color: "#0078D4",
        }));
        setTutorias(tutoriasData);
      });

      const notificacionesQuery = query(
        collection(db, "notificaciones"),
        where("receptorId", "==", usuario.id)
      );
      const unsubscribeNotificaciones = onSnapshot(
        notificacionesQuery,
        (querySnapshot) => {
          const hasUnread = querySnapshot.docs.some((doc) => !doc.data().leido);
          setHasUnreadNotifications(hasUnread);
        }
      );

      return () => {
        unsubscribeTutorias();
        unsubscribeNotificaciones();
      };
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const renderItem = ({ item }: { item: TutorItem }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleCardPress(item.id)}
      style={styles.advisoryCard}>
      <Image
        source={require("../../assets/icons/POO.jpg")}
        style={styles.advisoryImageBackground}
      />
      <View style={styles.advisoryContent}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.tutorName}>{item.tutor}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.modeText}>Virtual</Text>
        </View>
        <Text style={styles.activeStatus}>Activo</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeHeader}>
          <Image
            source={require("../../assets/icons/profile-picture.png")}
            style={styles.profilePicture}
          />
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.studentName}>Bienvenido, Estudiante</Text>
            <Text style={styles.studentName}>{studentName}</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleTutoresPress}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNotificationsPress}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#000"
                style={styles.iconSpacing}
              />
              {hasUnreadNotifications && (
                <View style={styles.notificationDot} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {tutorias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Por el momento no tienes tutorías asignadas.</Text>
          </View>
        ) : (
          <FlatList
            data={tutorias}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={() => (
              <>
                <View style={styles.mainAdvisoryContainer}>
                  <View style={styles.advisoryContent}>
                    <View style={styles.advisoryTitleContainer}>
                      <Ionicons name="book-outline" size={16} color="#34A853" />
                      <Text style={styles.advisoryTitle}> Asesoría Principal</Text>
                    </View>
                    <Text style={styles.advisorySubject}>
                      Diseño y Arquitectura del Software
                    </Text>
                    <View style={styles.advisoryButtonsContainer}>
                      <TouchableOpacity
                        onPress={handleChatPress}
                        style={styles.chatButton}>
                        <Text style={styles.chatButtonText}>Ir al chat</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Image
                    source={require("../../assets/icons/pana1.png")}
                    style={styles.advisoryImage}
                  />
                </View>

                <View style={styles.content}>
                  <Text style={styles.subtitle}>Mis asesorias</Text>
                </View>
              </>
            )}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
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
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    fontWeight: "600",
  },
  advisoryButtonsContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  chatButton: {
    backgroundColor: "#0078D4",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 6,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  advisoryImage: {
    width: 170,
    height: 140,
    resizeMode: "contain",
    marginLeft: 17,
    transform: [{ scale: 1.3 }],
  },
  content: {
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 10,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  advisoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    padding: 12,
    shadowRadius: 4,
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
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
