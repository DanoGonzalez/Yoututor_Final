import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { TutoresScreenProps } from "../../types";
import { getTutores } from "../../controllers/usuariosController";
import { Usuario } from "../../models/usuarios";
import { Materia } from "../../models/materias";
import { getmaterias, getMateria } from "../../controllers/materiasController";
import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../../utils/Firebase";

const COLORS = ["#007AFF", "#34C759", "#FF9500"];

const TutoresScreen: React.FC = () => {
  const navigation = useNavigation<TutoresScreenProps["navigation"]>();
  const [tutores, setTutores] = useState<Usuario[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);

  const handleBackPress = () => {
    setSelectedMateria(null); // Reinicia el filtro al regresar
    navigation.navigate("Home");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tutoresData, materiasData] = await Promise.all([
        getTutores(),
        getmaterias(),
      ]);
      setTutores(tutoresData);
      setMaterias(materiasData);
    } catch (error) {
      setError("Error al obtener los datos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (selectedMateria) {
      fetchTutoresPorMateria(selectedMateria);
    } else {
      fetchAllTutores();
    }
  }, [selectedMateria]);

  const fetchTutoresPorMateria = async (id: string) => {
    console.log("Buscando tutores por materia:", id);
    try {
      setLoading(true);
      const tutoresCollection = collection(db, "usuarios");
      const q = query(
        tutoresCollection,
        where("role", "==", 3),
        where("status", "==", 1),
        where("statusExam", "==", 1),
        where("materiasDominadas", "array-contains", id)
      );
      const querySnapshot = await getDocs(q);
      const filteredTutores: Usuario[] = [];
      querySnapshot.forEach((doc) => {
        filteredTutores.push({ id: doc.id, ...doc.data() } as Usuario);
      });
      await enrichTutoresWithMaterias(filteredTutores);
    } catch (error) {
      console.error("Error al obtener tutores por materia:", error);
      setError("Error al obtener tutores por materia");
    } finally {
      setLoading(false);
    }
  };

  const enrichTutoresWithMaterias = async (tutores: Usuario[]) => {
    const enrichedTutores = await Promise.all(
      tutores.map(async (tutor) => {
        const materiasDominadas = await Promise.all(
          tutor.materiasDominadas.map(async (materiaId) => {
            const materia = await getMateria(materiaId);
            return materia.materia;
          })
        );
        return { ...tutor, materiasDominadas };
      })
    );
    setTutores(enrichedTutores);
  };

  const fetchAllTutores = async () => {
    console.log("Buscando todos los tutores...");
    try {
      setLoading(true);
      const tutoresData = await getTutores();
      setTutores(tutoresData);
    } catch (error) {
      console.error("Error al obtener todos los tutores:", error);
      setError("Error al obtener todos los tutores");
    } finally {
      setLoading(false);
    }
  };

  const subjects = materias.map((materia, index) => ({
    ...materia,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Asesoria</Text>
      </View>

      <View style={styles.subjectsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectsContainer}>
          <TouchableOpacity
            onPress={() => setSelectedMateria(null)} // Mostrar todos los tutores
            style={[styles.subjectCard, { backgroundColor: "#8E8E93" }]}>
            <Text style={styles.subjectName}>Todos</Text>
          </TouchableOpacity>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.materia}
              onPress={() => subject.id && setSelectedMateria(subject.id)}
              style={[styles.subjectCard, { backgroundColor: subject.color }]}>
              <Text style={styles.subjectName}>{subject.materia}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Tutores</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0078FF" />
      ) : (
        <ScrollView style={styles.tutorsContainer}>
          {tutores.length === 0 ? (
            <Text style={styles.noTutorsText}>
              No hay tutores disponibles para esta materia.
            </Text>
          ) : (
            tutores.map((tutor) => (
              <TouchableOpacity
                key={tutor.id}
                style={styles.tutorCard}
                onPress={() =>
                  tutor.id !== undefined &&
                  navigation.navigate("TutorDetailsScreen", { tutorId: tutor.id })
                }>
                <View style={styles.tutorInfo}>
                  <Image
                    source={require("../../assets/SearchAsesor/Profile.png")}
                    style={styles.profileImage}
                  />
                  <View style={styles.tutorDetails}>
                    <Text
                      style={
                        styles.tutorName
                      }>{`${tutor.nombres} ${tutor.apellidos}`}</Text>
                    <Text style={styles.tutorSubject}>
                      {tutor.materiasDominadas.length > 0
                        ? tutor.materiasDominadas[0]
                        : "Sin materia"}
                    </Text>
                  </View>
                </View>
                <Image
                  source={
                    tutor.status === 1
                      ? require("../../assets/SearchAsesor/active.png")
                      : require("../../assets/SearchAsesor/inactive.png")
                  }
                  style={styles.statusIcon}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  subjectsWrapper: {
    height: 100, // Altura fija para el contenedor de materias
  },
  subjectsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  subjectCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  subjectName: {
    color: "white",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  tutorsContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  tutorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tutorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tutorDetails: {
    marginLeft: 12,
  },
  tutorName: {
    fontSize: 16,
    fontWeight: "500",
  },
  tutorSubject: {
    fontSize: 14,
    color: "#666",
  },
  statusIcon: {
    width: 12,
    height: 12,
  },
  noTutorsText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});

export default TutoresScreen;
