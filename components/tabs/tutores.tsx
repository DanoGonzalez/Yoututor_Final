import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TutoresScreenProps } from "../../types"; // Adjust the import path as needed

const TutoresScreen: React.FC = () => {
  const navigation = useNavigation<TutoresScreenProps["navigation"]>();

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const categories = [
    "Programación",
    "Backend",
    "Diseño UI/UX",
    "Frontend",
    "Fullstack",
  ];

  const tutors = [
    {
      id: "1",
      subject: "Materia principal",
      category: "Categoría",
      tutor: "Tutor 1",
      platform: "Plataforma",
      color: "#0078FF",
    },
    {
      id: "2",
      subject: "Materia principal",
      category: "Categoría",
      tutor: "Tutor 1",
      platform: "Plataforma",
      color: "#C4C4C4",
    },
    {
      id: "3",
      subject: "Materia principal",
      category: "Categoría",
      tutor: "Tutor 1",
      platform: "Plataforma",
      color: "#0078FF",
    },
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.tutorsContainer}>
        {tutors.map((tutor) => (
          <View
            key={tutor.id}
            style={[styles.tutorCard, { backgroundColor: tutor.color }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.subjectText}>{tutor.subject}</Text>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.categoryText}>{tutor.category}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.tutorInfo}>
                <Ionicons name="location-outline" size={16} color="#FFF" />
                <Text style={styles.platformText}>{tutor.platform}</Text>
              </View>
              <View style={styles.tutorInfo}>
                <Ionicons name="person-circle-outline" size={16} color="#FFF" />
                <Text style={styles.tutorText}>{tutor.tutor}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
    paddingHorizontal: 16,
  },
  categoryButton: {
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    color: "#0078FF",
    fontWeight: "500",
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
