import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TutoresScreenProps } from "../../types";
import { getTutores } from "../../controllers/usuariosController";
import { Usuario } from '../../models/usuarios';

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
        setError('Error al obtener los tutores');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutores();
  }, []);

  const categories = [
    "Programación",
    "Backend",
    "Diseño UI/UX",
    "Frontend",
    "Fullstack",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Busca tu próximo asesor</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Text style={styles.categoryTextFilter}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0078FF" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : (
        <ScrollView style={styles.tutorsContainer}>
          {tutores.map((tutor, index) => (
            <TouchableOpacity
              key={tutor.id}
              style={[
                styles.tutorCard,
                { backgroundColor: index % 2 === 0 ? "#0078FF" : "#C4C4C4" },
              ]}
              onPress={() => tutor.id !== undefined && navigation.navigate('TutorDetailsScreen', { tutorId: tutor.id })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.subjectText}>
                  {tutor.materiasDominadas.length > 0 ? tutor.materiasDominadas[0] : "Materia principal"}
                </Text>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.categoryText}>{tutor.tecnologias.join(", ")}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.tutorInfo}>
                  <Ionicons name="location-outline" size={16} color="#FFF" />
                  <Text style={styles.platformText}>
                    {tutor.tecnologias.length > 0 ? tutor.tecnologias[0] : "Plataforma"}
                  </Text>
                </View>
                <View style={styles.tutorInfo}>
                  <Ionicons name="person-circle-outline" size={16} color="#FFF" />
                  <Text style={styles.tutorText}>{`${tutor.nombres} ${tutor.apellidos}`}</Text>
                </View>
              </View>
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
  categoriesContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  categoryButton: {
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    height: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryText: {
    color: "#FFF",
    fontWeight: "500",
  },
  categoryTextFilter: {
    color: "#0078FF",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: "#0078FF",
    marginTop: 10,
  },
  tutorsContainer: {
    padding: 16,
  },
  tutorCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subjectText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tutorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  platformText: {
    color: "#FFFFFF",
    marginLeft: 4,
  },
  tutorText: {
    color: "#FFFFFF",
    marginLeft: 4,
  },
});

export default TutoresScreen;
