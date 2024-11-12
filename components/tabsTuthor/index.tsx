import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";

import { ThemedView } from "../ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabParamList, TutorStackParamList } from "../../types";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

const { width } = Dimensions.get("window");

interface TutorItem {
  id: string;
  subject: string;
  category: string;
  tutor: string;
  color: string;
}

// Datos simulados de ejemplo
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

const HomeScreenTutor = () => {
  const navigation = useNavigation<StackNavigationProp<TutorStackParamList>>();

  const handleNotificationsPress = () => {
    navigation.navigate("NotificacionesScreen");
  };
  const renderItem = ({ item }: { item: TutorItem }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.subject}>{item.subject}</Text>
        <TouchableOpacity>
          <Image
            source={require("../../assets/icons/twoPoints.png")}
            style={styles.moreIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.category}>{item.category}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.tutorInfo}>
          <Image
            source={require("../../assets/icons/genericProfile.png")}
            style={styles.profileIcon}
          />
          <Text style={styles.tutor}>{item.tutor}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Image
            source={require("../../assets/icons/plusIcons.png")}
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.tutoresButton}
          onPress={() => navigation.navigate("ScheduleConsulting")}>
          <Text style={styles.tutoresButtonText}>Agendar Asesoría</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={30}
              color="#0078FF"
              onPress={handleNotificationsPress}
            />
          </TouchableOpacity>
        <ThemedView style={styles.content}>
          <Text style={styles.subtitle}>Próximos Estudiantes</Text>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </ThemedView>
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
  addIcon: {
    width: 18,
    height: 18,
    tintColor: "#0078FF",
  },
});

export default HomeScreenTutor;
