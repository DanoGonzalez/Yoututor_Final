import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { ThemedView } from "../../components/ThemedView";

export default function MessagesScreen() {
  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <ThemedView style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/icons/signup_tutores.png")}
            style={styles.classroomIcon}
          />
          <Text style={styles.notificiacionesText}>Notificiaciones</Text>
        </View>
        <ScrollView style={styles.notificationList}>
          <TouchableOpacity style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>
                Jose Ernesto ha enviado solicitud
              </Text>
              <Text style={styles.notificationDescription}>
                Desea ingresar a una tutoría
              </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>:</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.notificationItem, styles.notificationItemGray]}>
            <View style={styles.notificationContent}>
              <Text style={[styles.notificationTitle, styles.grayText]}>
                Andy Castillo ha enviado un correo
              </Text>
              <Text style={[styles.notificationDescription, styles.grayText]}>
                Revisa tus correos para obtener mas información
              </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={[styles.moreButtonText, styles.grayText]}>:</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0078FF",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  notificationIcon: {
    width: 30,
    height: 30,
    tintColor: "#FFFFFF",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  classroomIcon: {
    width: 160,
    height: 160,
  },
  notificiacionesText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  notificationList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0078FF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  notificationItemGray: {
    backgroundColor: "#F0F0F0",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  moreButton: {
    padding: 5,
  },
  moreButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  grayText: {
    color: "#000000",
  },
});
