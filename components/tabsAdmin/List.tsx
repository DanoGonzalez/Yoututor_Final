import React, { useState, useEffect } from "react";
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
import AcceptTutorModal from "./modal/AcceptTutorModal";
import RejectTutorModal from "./modal/RejectTutorModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsuario, getTutorPendientes, acceptTutor, rejectTutor } from "../../controllers/usuariosController";
import { Usuario } from "../../models/usuarios";
import { useNavigation } from "@react-navigation/native";
import {TutorDetailsScreenProps} from "../../types";

const AdminList = () => {
  const navigation = useNavigation<TutorDetailsScreenProps["navigation"]>();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingTutors, setPendingTutors] = useState<Usuario[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const usuarioData = await AsyncStorage.getItem("usuario");
      const usuario = usuarioData ? JSON.parse(usuarioData) : null;

      if (usuario) {
        const data = await getUsuario(usuario.id);
        setAdminName(data.nombres);
      }
    };

    fetchUserData();
  }, []);

  const fetchPendingTutors = async () => {
    try {
      const tutores = await getTutorPendientes();
      console.log("Tutores pendientes:", tutores);
      setPendingTutors(tutores);
    } catch (error) {
      console.error('Error fetching pending tutors:', error);
    }
  };

  useEffect(() => {
    fetchPendingTutors();
  }, []);

  const handleReject = async (tutorId: string) => {
    await rejectTutor(tutorId);
    setSelectedTutorId(Number(tutorId));
    fetchPendingTutors();
    setShowRejectModal(true);
  };

  const handleAccept = async (tutorId: string) => {
    console.log("Aceptar tutor con ID:", tutorId);
    await acceptTutor(tutorId);
    setSelectedTutorId(Number(tutorId));
    fetchPendingTutors();
    setShowAcceptModal(true);
  };

  const handleTutorDetails = (tutorId: string) => {
    console.log("Detalles del tutor con ID:", tutorId);
    navigation.navigate("TutorDetailsScreen", { tutorId });
  }


  const handleRejectConfirm = () => {
    if (selectedTutorId) {
      console.log("Rechazar tutor con ID:", selectedTutorId);
    }
    setShowRejectModal(false);
  };

  const handleAcceptConfirm = () => {
    if (selectedTutorId) {
      console.log("Aceptar tutor con ID:", selectedTutorId);
    }
    setShowAcceptModal(false);
  };

  const TutorCard = ({ tutor }: { tutor: Usuario }) => (
    <TouchableOpacity
      style={styles.tutorCard}
      onPress={() => tutor.id && handleTutorDetails(tutor.id)}
    >
      <Image 
        source={tutor.profilePicture ? { uri: tutor.profilePicture } : require("../../assets/AdminScreen/Subjects/Subject1.png")}
        style={styles.subjectImage} 
      />
      <View style={styles.cardContent}>
        <View style={styles.contentRow}>
          <View style={styles.textContainer}>
            <Text style={styles.subjectName}>{tutor.materiasDominadas || "Materia Desconocida"}</Text>
            <Text style={styles.tutorName}>{tutor.nombres}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton]}
              onPress={() => tutor.id && handleReject(tutor.id)}>
              <Image
                source={require("../../assets/AdminScreen/List/Rechazar.png")}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => tutor.id && handleAccept(tutor.id)}
              style={[styles.actionButton]}>
              <Image
                source={require("../../assets/AdminScreen/List/Aceptar.png")}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require("../../assets/icons/profile-picture.png")}
              style={styles.profilePic}
            />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Bienvenido. Admin</Text>
              <Text style={styles.adminName}>{adminName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.headerTitle}>Asesores pendientes</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          {pendingTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </ScrollView>

        <AcceptTutorModal
          visible={showAcceptModal}
          onClose={handleAcceptConfirm}
        />
        <RejectTutorModal
          visible={showRejectModal}
          onClose={handleRejectConfirm}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 12,
  },
  welcomeText: {
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 18,
    color: "#000",
    marginBottom: 2,
  },
  adminName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  listHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  scrollContainer: {
    padding: 20,
  },
  tutorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  tutorName: {
    fontSize: 16,
    color: "#666666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});

export default AdminList;
