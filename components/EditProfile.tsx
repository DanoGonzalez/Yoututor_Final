import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
// Importa tus imágenes
import profileImage from "../assets/Profile/User.jpg";
import emailIcon from "../assets/Profile/outlook.png";
import materialIcon from "../assets/Profile/book.png";
import jsIcon from "../assets/Profile/js.png";
import reactIcon from "../assets/Profile/react.png";
import githubIcon from "../assets/Profile/github.png";

export default function EditPerfilScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.editButtonContainer}>
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="pencil" size={15} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            source={profileImage} // Usa la imagen local en lugar de la URL
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>John Smith</Text>
        <Text style={styles.role}>Tutor</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.contactContainer}>
          <View style={styles.contactItemLeft}>
            <Image source={emailIcon} style={styles.icon} />
            <Text style={styles.contactText}>Garcia@gmail.com</Text>
          </View>
          <View style={styles.contactItemRight}>
            <Image source={materialIcon} style={styles.icon} />
            <Text style={styles.contactText}>P00</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>
            Hello! I'm Mr. Ravi Kumar, a dedicated and passionate educator with
            a focus on helping students excel in their academic journey. With
            several years of teaching experience, I believe in fostering a
            supportive and engaging learning environment to encourage students'
            growth and development.
          </Text>
        </View>

        <View style={styles.technologiesContainer}>
          <Text style={styles.sectionTitle}>Tecnologías</Text>
          <View style={styles.technologyIcons}>
            <Image
              source={jsIcon}
              style={[styles.icon, { width: 50, height: 50 }]}
            />
            <Image
              source={reactIcon}
              style={[styles.icon, { width: 50, height: 50 }]}
            />
            <Image
              source={githubIcon}
              style={[styles.icon, { width: 50, height: 50 }]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#0078FF",
    paddingBottom: 110, // Ajusta este valor según tus necesidades
    paddingTop: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 30, // Alinea verticalmente con el título "Perfil"
  },
  icon: {
    width: 24, // Ajusta el tamaño según necesites
    height: 24,
    marginRight: 5, // Espacio entre el icono y el texto
  },
  technologyIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 1,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 60,
    alignItems: "center",
    marginTop: -45,
    position: "relative",
  },
  editButtonContainer: {
    position: "absolute",
    top: 14,
    right: 14,
  },
  editButton: {
    backgroundColor: "#9F9999",
    borderRadius: 20,
    padding: 13,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  profileImageContainer: {
    position: "absolute",
    top: -50,
    width: 130,
    height: 130,
    borderRadius: 90,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "regular",
    color: "#545454",
    marginTop: 30,
  },
  role: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#545454",
  },
  contentContainer: {
    paddingHorizontal: 30,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  contactItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    color: "#545454",
    marginLeft: 10,
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#545454",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#545454",
    marginBottom: 10,
  },
  technologiesContainer: {
    marginBottom: 20,
  },
});
