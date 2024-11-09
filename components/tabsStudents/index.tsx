import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Image, // Asegúrate de importar Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types"; // Ajusta el path si es necesario

const { width } = Dimensions.get("window");

interface TutorItem {
  id: string;
  subject: string;
  category: string;
  tutor: string;
  color: string;
}

const data: TutorItem[] = [
  {
    id: "1",
    subject: "Materia principal",
    category: "Categoría",
    tutor: "Tutor 1",
    color: "#0078FF",
  },
  {
    id: "2",
    subject: "Materia principal",
    category: "Categoría",
    tutor: "Tutor 2",
    color: "#C4C4C4",
  },
  {
    id: "3",
    subject: "Materia principal",
    category: "Categoría",
    tutor: "Tutor 3",
    color: "#0078FF",
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleTutoresPress = () => {
    navigation.navigate("Tutores");
  };

  const handleNotificationsPress = () => {
    navigation.navigate("NotificacionesScreen");
  }

  const renderItem = ({ item }: { item: TutorItem }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.subject}>{item.subject}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.category}>{item.category}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.tutorInfo}>
          <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" style={styles.profileIcon} />
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
        <View style={styles.header}>
          <Image
            source={require("../../assets/icons/book.png")}
            style={styles.logo}
          />
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={30} color="#0078FF" onPress={handleNotificationsPress} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.tutoresButton}
          onPress={handleTutoresPress}>
          <Text style={styles.tutoresButtonText}>Tutores</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Próximas Asesorías</Text>
          <FlatList
            data={data}
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
  tutoresButton: {
    backgroundColor: "#F0F8FF",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tutoresButtonText: {
    color: "#0078FF",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 27,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  logo: {
    width: 120,  // Ajusta el tamaño del logo
    height: 40,  // Ajusta el tamaño del logo
    resizeMode: "contain", // Asegura que el logo no se deforme
  },
});

export default HomeScreen;
