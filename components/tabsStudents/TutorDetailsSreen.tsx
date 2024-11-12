import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import emailIcon from "../../assets/Profile/outlook.png";
import materialIcon from "../../assets/Profile/book.png";
import jsIcon from "../../assets/Profile/js.png";
import reactIcon from "../../assets/Profile/react.png";
import githubIcon from "../../assets/Profile/github.png";
import userImage from "../../assets/TutorDetails/Doctor 1.png";

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Capas de LinearGradient para crear 4 líneas diagonales */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0)"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.diagonalLine, { top: 0 }]}
        />
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0)"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.diagonalLine, { top: 180 }]}
        />
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0)"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.diagonalLine, { top: 360 }]}
        />

        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Solicitar Tutor</Text>
      </View>

      <View style={styles.profileContainer}>
      <View style={styles.userImageContainer}>
          <Image
            source={userImage} // Usa la imagen local en lugar de la URL
            style={styles.userImage}
          />
        </View>
        <Text style={styles.name}>John Smith</Text>
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
          <Text style={styles.descriptionText}>
            Book an appointment with doctor. Chat with doctor via appointment letter and get consultation.
          </Text>
        </View>
      </View>

      {/* Botón de Solicitar */}
      <TouchableOpacity style={styles.requestButton}>
        <Text style={styles.requestButtonText}>Solicitar</Text>
      </TouchableOpacity>
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
    paddingBottom: 400,
    paddingTop: 30,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  diagonalLine: {
    position: "absolute",
    left: -140,
    right: -250,
    height: 70,
    transform: [{ rotate: "320deg" }],
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
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
    alignItems: "center",
    marginTop: -45,
    position: "relative",
  },
  userImageContainer: {
    position: "absolute",
    top: -316,
    width: 260,
    height: 320,
    overflow: "hidden",
    borderColor: "#fff",
  },
  userImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#545454",
    marginTop: 30,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingBottom: 80, // Espacio adicional para el botón inferior
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
  descriptionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#545454",
    marginBottom: 10,
  },
  requestButton: {
    backgroundColor: "#0078FF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    left: "10%",
    right: "10%",
    alignItems: "center",
  },
  requestButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
