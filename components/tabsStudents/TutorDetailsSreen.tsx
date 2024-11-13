import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import emailIcon from "../../assets/Profile/outlook.png";
import materialIcon from "../../assets/Profile/book.png";
import userImage from "../../assets/TutorDetails/Doctor 1.png";

export default function TutorDetailsScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={[]}
        keyExtractor={() => "key"}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.header}>
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
                <Image source={userImage} style={styles.userImage} />
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
                  Book an appointment with doctor. Chat with doctor via
                  appointment letter and get consultation.Contrary to popular
                  belief, Lorem Ipsum is not simply random text. It has roots in
                  a piece of classical Latin literature from 45 BC, making it
                  over 2000 years old. Richard McClintock, a Latin professor at
                  Hampden-Sydney College in Virginia, looked up one of the more
                  obscure Latin words, consectetur, from a Lorem Ipsum passage,
                  and going through the cites of the word in classical
                  literature, discovered the undoubtable source. Lorem Ipsum
                  comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum
                  et Malorum" (The Extremes of Good and Evil) by Cicero, written
                  in 45 BC. This book is a treatise on the theory of ethics,
                  very popular during the Renaissance. The first line of Lorem
                  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
                  section 1.10.32. The standard chunk of Lorem Ipsum used since
                  the 1500s is reproduced below for those interested. Sections
                  1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by
                  Cicero are also reproduced in their exact original form,
                  accompanied by English versions from the 1914 translation by
                  H. Rackham.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.requestButton}>
              <Text style={styles.requestButtonText}>Solicitar</Text>
            </TouchableOpacity>
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
    paddingBottom: 80,
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
