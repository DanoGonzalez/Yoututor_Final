import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import profileImage from "../assets/Profile/user.jpg";
import emailIcon from "../assets/Profile/outlook.png";
import materialIcon from "../assets/Profile/book.png";
import jsIcon from "../assets/Profile/js.png";
import reactIcon from "../assets/Profile/react.png";
import githubIcon from "../assets/Profile/github.png";

export default function PerfilScreen() {
  const handleOpenUrl = (url: string) => {
    Linking.openURL(url);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log("Cerrando sesión");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={[]} // Lista vacía para habilitar el scroll
        keyExtractor={() => "key"}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Perfil</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.editButtonContainer}>
                <TouchableOpacity style={styles.editButton}>
                  <MaterialIcons name="edit" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileImageContainer}>
                <Image source={profileImage} style={styles.profileImage} />
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
                  Hello! I'm Mr. Ravi Kumar, a dedicated and passionate educator
                  with a focus on helping students excel in their academic
                  journey. With several years of teaching experience, I believe
                  in fostering a supportive and engaging learning environment to
                  encourage students' growth and development. It is a long
                  established fact that a reader will be distracted by the
                  readable content of a page when looking at its layout. The
                  point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here', making it look like readable English.
                  Many desktop publishing packages and web page editors now use
                  Lorem Ipsum as their default model text, and a search for
                  'lorem ipsum' will uncover many web sites still in their
                  infancy. Various versions have evolved over the years,
                  sometimes by accident, sometimes on purpose (injected humour
                  and the like).
                </Text>
              </View>

              <View style={styles.technologiesContainer}>
                <Text style={styles.sectionTitle}>Tecnologías</Text>
                <View style={styles.technologyIcons}>
                  <Image
                    source={jsIcon}
                    style={[styles.icon, { width: 40, height: 40 }]}
                  />
                  <Image
                    source={reactIcon}
                    style={[styles.icon, { width: 40, height: 40 }]}
                  />
                  <Image
                    source={githubIcon}
                    style={[styles.icon, { width: 40, height: 40 }]}
                  />
                </View>
              </View>

              {/* Iconos de GitHub y LinkedIn como botones al final */}
              <Text style={styles.sectionTitle}>Redes</Text>
              <View style={styles.socialIconsContainer}>
                <TouchableOpacity
                  onPress={() => handleOpenUrl("https://github.com/username")}
                >
                  <FontAwesome name="github" size={40} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleOpenUrl("https://linkedin.com/in/username")
                  }
                >
                  <FontAwesome
                    name="linkedin-square"
                    size={40}
                    color="#0078FF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#0078FF",
    paddingBottom: 110,
    paddingTop: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    padding: 5,
    right: 10,
    top: 22,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  technologyIcons: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
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
    backgroundColor: "#0078FF",
    borderRadius: 30,
    padding: 8,
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
  socialIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
    marginBottom: 30,
    gap: 20,
  },
});
