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
import { getUsuario } from "../../controllers/usuariosController";

const AdminList = () => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingTutors, setPendingTutors] = useState([
    {
      id: 1,
      name: "Angel Garcia Pech",
      subject: "Poo",
      image: require("../../assets/AdminScreen/Subjects/Subject1.png"),
    },
    {
      id: 2,
      name: "Angel Garcia Pech",
      subject: "Base de Datos",
      image: require("../../assets/AdminScreen/Subjects/Subject4.png"),
    },
    {
      id: 3,
      name: "Angel Garcia Pech",
      subject: "Base de Datos",
      image: require("../../assets/AdminScreen/Subjects/Subject2.png"),
    },
    {
      id: 4,
      name: "Angel Garcia Pech",
      subject: "Base de Datos",
      image: require("../../assets/AdminScreen/Subjects/Subject3.png"),
    },
    {
      id: 5,
      name: "Angel Garcia Pech",
      subject: "Base de Datos",
      image: require("../../assets/AdminScreen/Subjects/Subject1.png"),
    },
  ]);
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

  const handleReject = (tutorId: number) => {
    setSelectedTutorId(tutorId);
    setShowRejectModal(true);
  };

  const handleAccept = (tutorId: number) => {
    setSelectedTutorId(tutorId);
    setShowAcceptModal(true);
  };

  const handleRejectConfirm = () => {
    if (selectedTutorId) {
      setPendingTutors((prevTutors) =>
        prevTutors.filter((tutor) => tutor.id !== selectedTutorId)
      );
    }
    setShowRejectModal(false);
  };

  const handleAcceptConfirm = () => {
    if (selectedTutorId) {
      setPendingTutors((prevTutors) =>
        prevTutors.filter((tutor) => tutor.id !== selectedTutorId)
      );
    }
    setShowAcceptModal(false);
  };

  const TutorCard = ({ tutor }: { tutor: any }) => (
    <View style={styles.tutorCard}>
      <Image source={tutor.image} style={styles.subjectImage} />
      <View style={styles.cardContent}>
        <View style={styles.contentRow}>
          <View style={styles.textContainer}>
            <Text style={styles.subjectName}>{tutor.subject}</Text>
            <Text style={styles.tutorName}>{tutor.name}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => handleReject(tutor.id)}
              style={[styles.actionButton]}>
              <Image
                source={require("../../assets/AdminScreen/List/Rechazar.png")}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAccept(tutor.id)}
              style={[styles.actionButton]}>
              <Image
                source={require("../../assets/AdminScreen/List/Aceptar.png")}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
