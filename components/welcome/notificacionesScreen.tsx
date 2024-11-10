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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNotificaciones } from "../../controllers/notificacionesController";
import { NotificacionesScreenProps } from "../../types"; // Importa el tipo de props
import { Notificacion } from "../../models/notificaciones";
import { crearTutoria } from "../../controllers/tutoriasController";

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

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const renderItem = ({ item, index }: { item: Notificacion; index: number }) => (
    <View
      style={[styles.notificationCard, { backgroundColor: index % 2 === 0 ? "#0078FF" : "#DDDDDD" }]}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.mensaje}</Text>
        <Text style={styles.notificationTime}>{item.tipo}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.tutorInfo}>
          <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" style={styles.profileIcon} />
          <Text style={styles.tutor}>{item.estudianteNombre}</Text>
        </View>
        {!item.leido && item.tipo === 1 && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleAccept(item)}>
              <Text style={styles.actionButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleApprove(item)}>
              <Text style={styles.actionButtonText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
  

  const handleAccept = async (item: Notificacion) => {
    try {
      const tutorId = item.receptorId; // ID del tutor
      const estudianteId = item.solicitanteId; // ID del estudiante
      const materiaId = item.materiaId;
      const NotifiacionId = item.id;
      if (tutorId && estudianteId && materiaId && NotifiacionId) {
        console.log("Aceptar solicitud:", tutorId, estudianteId);
        const response = await crearTutoria(tutorId, estudianteId, materiaId, NotifiacionId);
        alert('Tutoria creada con éxito');
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
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <TouchableOpacity
            style={styles.notificationToggle}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="notifications-outline" size={30} color="#0078FF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={notificaciones}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || item.mensaje}
          contentContainerStyle={styles.notificationsList}
        />
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  headerTitle: {
    fontSize: 20,
    color: "#333333",
    fontWeight: "bold",
  },
  notificationToggle: {
    padding: 10,
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
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  notificationTime: {
    fontSize: 12,
    color: "#EEEEEE",
  },
  tutorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    marginRight: 5,
  },
  tutor: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: "#0078FF",
    fontWeight: "bold",
  },
  cardFooter: {
    alignItems: "center",
    marginTop: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NotificacionesScreen;