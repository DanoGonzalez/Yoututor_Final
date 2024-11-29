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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsuario, getUsuarios, getTutorPendientes } from "../../controllers/usuariosController";
import AddSubjectModal from "./modal/AddSubjectModal";
import SuccessModal from "./modal/SuccessModal";
import { getmaterias, addMateria } from "../../controllers/materiasController";

interface Subject {
  name: string;
  tutors: number;
  image: any;
}

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [pendingTutors, setPendingTutors] = useState<number>(0);

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

  useEffect(() => {
    const loadPendingTutors = async () => {
      try {
        const pendingTutors = await getTutorPendientes();
        setPendingTutors(pendingTutors.length);
      } catch (error) {
        console.error("Error loading pending tutors:", error);
      }
    };

    loadPendingTutors();

    const interval = setInterval(loadPendingTutors, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadMaterias = async () => {
    try {
      const materiasData = await getmaterias();
  
      const formattedSubjects = materiasData.map((materia) => {
        let imagePath;
  
        // Verifica si el id existe, si no, asigna un valor predeterminado (ej. "0")
        const materiaId = materia.id ? parseInt(materia.id, 10) : 0;
  
        // Switch para seleccionar la imagen según el id
        switch (materiaId) {
          case 1:
            imagePath = require("../../assets/AdminScreen/Subjects/Subject1.png");
            break;
          case 2:
            imagePath = require("../../assets/AdminScreen/Subjects/SQL.jpg");
            break;
          case 3:
            imagePath = require("../../assets/AdminScreen/Subjects/Subject3.png");
            break;
          case 4:
            imagePath = require("../../assets/AdminScreen/Subjects/devOps.png");
            break;
          case 5:
            imagePath = require("../../assets/AdminScreen/Subjects/ingles.jpg");
            break;
          default:
            imagePath = require("../../assets/AdminScreen/Subjects/Subject2.png"); // Imagen por defecto
            break;
        }
  
        return {
          name: materia.materia || "Sin Nombre", // Nombre predeterminado si falta
          tutors: 0,
          image: imagePath,
        };
      });
  
      console.log("Materias cargadas:", materiasData);
      setSubjects(formattedSubjects);
    } catch (error) {
      console.error("Error loading materias:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    loadMaterias();
  }, []);

  const handleAddSubject = async (subjectName: string) => {
    try {
      await addMateria(subjectName);
      setShowSuccessModal(true);
      await loadMaterias();
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const loadTotalUsers = async () => {
    try {
      const usuarios = await getUsuarios();
      setTotalUsers(usuarios.length);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadTotalUsers();
    const interval = setInterval(loadTotalUsers, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
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

        {/* Control Panel Section */}
        <View style={styles.controlPanel}>
          <View style={styles.panelHeader}>
            <Image
              source={require("../../assets/AdminScreen/Gear.png")}
              style={styles.gearIcon}
            />
            <Text style={styles.panelTitle}>Panel de control</Text>
          </View>

          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statBox}>
              <Text style={styles.statLabel}>Usuarios Registrados</Text>
              <Text style={styles.statNumber}>{totalUsers}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlinedBox}>
              <Text style={styles.outlinedLabel}>Tutores por Aprobar</Text>
              <Text style={styles.outlinedNumber}>{pendingTutors}</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={require("../../assets/AdminScreen/Guys.png")}
            style={styles.guysImage}
          />
        </View>

        {/* Subjects Section */}
        <View style={styles.subjectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Materias</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Image
                source={require("../../assets/AdminScreen/Add.png")}
                style={styles.addIcon}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}>
            <View style={styles.subjectsGrid}>
              {subjects.map((subject, index) => (
                <TouchableOpacity key={index} style={styles.subjectCard}>
                  <Image source={subject.image} style={styles.subjectImage} />
                  <View style={styles.cardContent}>
                    <View style={styles.subjectNameContainer}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Image
                        source={require("../../assets/AdminScreen/mark.png")}
                        style={styles.bookmarkIcon}
                      />
                    </View>

                    {/* <Text style={styles.tutorLabel}>Tutores disponibles</Text>
                    <Text style={styles.tutorCount}>{subject.tutors}</Text> */}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <AddSubjectModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddSubject}
        />

        <SuccessModal
          visible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
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
  controlPanel: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  gearIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: "#34A853",
  },
  panelTitle: {
    fontSize: 14,
    color: "#34A853",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "column",
    gap: 10,
  },
  statBox: {
    backgroundColor: "#0078FF",
    borderRadius: 12,
    padding: 15,
    width: "50%",
  },
  outlinedBox: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0078FF",
    borderRadius: 12,
    padding: 15,
    width: "50%",
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  outlinedNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0078FF",
    textAlign: "center",
  },
  outlinedLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0078FF",
    textAlign: "center",
  },
  guysImage: {
    width: "50%",
    height: 210,
    resizeMode: "contain",
    position: "absolute",
    right: 10,
    top: 1,
  },

  subjectCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    position: "relative",
  },
  subjectImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    backgroundColor: "#E8F3F1",
  },
  cardContent: {
    padding: 14,
  },
  subjectName: {
    fontSize: 16,
    color: "#000",
  },
  tutorLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  tutorCount: {
    fontSize: 16,
    color: "#0078FF",
    fontWeight: "600",
  },

  bookmarkIcon: {
    width: 14,
    height: 21,
    resizeMode: "contain",
    tintColor: "#34A853",
  },
  subjectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  subjectsSection: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  subjectNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default AdminDashboard;