import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNotificaciones } from "../../controllers/notificacionesController";
import { NotificacionesScreenProps } from "../../types";
import { Notificacion } from "../../models/notificaciones";
import { crearTutoria } from "../../controllers/tutoriasController";
import { useFocusEffect } from "@react-navigation/native";

const NotificacionesScreen: React.FC<NotificacionesScreenProps> = ({ navigation }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotificaciones = async () => {
    try {
      const usuario = await AsyncStorage.getItem("usuario");
      if (usuario) {
        const { id } = JSON.parse(usuario);
        const fetchedNotificaciones = await getNotificaciones(id);
        setNotificaciones(fetchedNotificaciones);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNotificaciones();
    }, [])
  );
  const getNotificationText = (tipo: number, nombre: string) => {
    switch (tipo) {
      case 1:
        return `El Estudiante ${nombre}`;
      case 2:
      case 3:
        return `El Tutor ${nombre}`;
      default:
        return nombre;
    }
  };
  
  
  const renderItem = ({ item }: { item: Notificacion }) => {
    let iconSource;
    switch (item.tipo) {
      case 1:
        iconSource = require("../../assets/icons/iconSoli.png");
        break;
      case 2:
        iconSource = require("../../assets/icons/iconSuccess.png");
        break;
      case 3:
        iconSource = require("../../assets/icons/iconReject.png");
        break;
    }

    return (
      <View style={[styles.notificationCard, { backgroundColor: "#F1F1F1" }]}>
        <View style={styles.notificationContent}>
          <Image source={iconSource} style={styles.icon} />
          <View style={styles.messageContainer}>
          <Text style={styles.tutor}>
              {getNotificationText(item.tipo, item.estudianteNombre || "")}
          </Text>
            <Text style={styles.messageText}>{item.mensaje}</Text>
          </View>
        </View>
        {!item.leido && item.tipo === 1 && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleAccept(item)}>
              <Text style={styles.actionButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton2} onPress={() => handleApprove(item)}>
              <Text style={styles.actionButtonText2}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleAccept = async (item: Notificacion) => {
    try {
      const tutorId = item.receptorId;
      const estudianteId = item.solicitanteId;
      const materiaId = item.materiaId;
      const NotifiacionId = item.id;
      if (tutorId && estudianteId && materiaId && NotifiacionId) {
        console.log("Aceptar solicitud:", tutorId, estudianteId);
        const response = await crearTutoria(tutorId, estudianteId, materiaId, NotifiacionId);
        alert("Tutoria creada con éxito");
        await fetchNotificaciones();
      } else {
        console.error("Error: Missing required fields");
      }
    } catch (error) {
      console.error("Error al aceptar la solicitud:", error);
    }
  };

  const handleApprove = (item: Notificacion) => {
    console.log("Rechazar solicitud:", item);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0078FF" style={styles.loadingIndicator} />;
  }

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.leftSection}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Notificaciones</Text>
        </View>

        {notificaciones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/icons/iconNotificaciones.png")}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>No hay notificaciones</Text>
          </View>
        ) : (
          <FlatList
            data={notificaciones}
            renderItem={renderItem}
            keyExtractor={(item) => item.id || item.mensaje}
            contentContainerStyle={styles.notificationsList}
          />
        )}
      </SafeAreaView>
    </>
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
    padding: 20,
    justifyContent: "center",
  },
  leftSection: {
    position: "absolute",
    left: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  notificationCard: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  tutor: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  messageText: {
    fontSize: 14,
    color: "#000000",
  },
  messageContainer: {
    flex: 1,
    marginLeft: 10,
  },
  actionButton: {
    backgroundColor: "#0078FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButton2: {
    backgroundColor: "#FAFAFA",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#0078FF",
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  actionButtonText2: {
    color: "#0078FF",
    fontWeight: "bold",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 8,
    resizeMode: "contain",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  emptyText: {
    fontSize: 16,
    color: "#777777",
  },
});

export default NotificacionesScreen;
