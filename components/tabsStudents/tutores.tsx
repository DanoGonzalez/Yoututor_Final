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
import { useNavigation } from "@react-navigation/native";
import { TutoresScreenProps } from "../../types";
import { getTutores } from "../../controllers/usuariosController";
import { Usuario } from "../../models/usuarios";

const COLORS = ["#007AFF", "#34C759", "#FF9500"];

const TutoresScreen: React.FC = () => {
  const navigation = useNavigation<TutoresScreenProps["navigation"]>();
  const [tutores, setTutores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  useEffect(() => {
    const fetchTutores = async () => {
      try {
        setLoading(true);
        const data = await getTutores();
        setTutores(data);
      } catch (error) {
        setError("Error al obtener los tutores");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutores();
  }, []);

  const subjects = [
    { id: 1, name: "Matematicas" },
    { id: 2, name: "Biologia" },
    { id: 3, name: "English" },
    { id: 4, name: "SQL" },
    { id: 5, name: "Programacion" },
  ].map((subject) => ({
    ...subject,
    color: COLORS[(subject.id - 1) % COLORS.length],
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
          {subjects.map((subject) => (
            <View
              key={subject.id}
              style={[styles.subjectCard, { backgroundColor: subject.color }]}>
              <Text style={styles.subjectNumber}>{subject.id}</Text>
              <Text style={styles.subjectName}>{subject.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Tutores</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0078FF" />
      ) : (
        <ScrollView style={styles.tutorsContainer}>
          {tutores.map((tutor) => (
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
          ))}
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
  subjectNumber: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
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
});

export default TutoresScreen;
