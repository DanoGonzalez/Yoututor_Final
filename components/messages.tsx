import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import ChatListItem from "./ChatListItem";
import { RootStackParamList } from "../types";
import { getChatEstudiante, getChatTutor } from "../controllers/chatsController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chats } from "../models/chats"; // Importamos la interfaz original ChatData
import { onSnapshot, query, where, collection } from "firebase/firestore";
import { db } from "../utils/Firebase";

export default function MessagesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [chats, setChats] = useState<Chats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChats = async () => {
    try {
      console.log("Obteniendo chats...");
      const usuarioData = await AsyncStorage.getItem("usuario");
      const usuario = usuarioData ? JSON.parse(usuarioData) : null;
      const usuarioId = usuario?.id;
      const usuarioRol = usuario?.role;

      if (!usuarioId) {
        setError("No se encontró información del usuario.");
        setLoading(false);
        return;
      }

      let initialChats: Chats[] = [];
      if (usuarioRol === 2) {
        initialChats = await getChatEstudiante(usuarioId);
      } else if (usuarioRol === 3) {
        initialChats = await getChatTutor(usuarioId);
      }

      // Añadir la propiedad isUnread según el valor de mensajesCount
      const extendedChats = initialChats.map(chat => ({
        ...chat,
        isUnread: chat.mensajesCount > 0, // Si hay mensajes no leídos, marcar como no leído
      }));

      setChats(extendedChats);
      setLoading(false);

      // Crear una suscripción en tiempo real a los cambios en los chats
      const chatData = collection(db, "chats");
      let chatsQuery;
      if (usuarioRol === 2) {
        chatsQuery = query(chatData, where("estudianteId", "==", usuarioId));
      } else if (usuarioRol === 3) {
        chatsQuery = query(chatData, where("tutorId", "==", usuarioId));
      }

      if (chatsQuery) {
        const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
          const updatedChats = querySnapshot.docs.map((doc) => {
            const data = doc.data() as Chats;
            const existingChat = initialChats.find(chat => chat.id === doc.id);

            return {
              ...data,
              id: doc.id,
              avatar: existingChat?.tutorInfo?.profilePicture || existingChat?.estudianteInfo?.profilePicture || "", // Usamos el avatar que ya se obtuvo
              displayName: existingChat?.tutorInfo?.nombres || existingChat?.estudianteInfo?.nombres || "", // Usamos el nombre que ya se obtuvo
              isUnread: data.mensajesCount > 0, // Actualizar estado de no leído
            };
          });
          setChats(updatedChats);
        });

        // Si el componente se desmonta, cancelar la suscripción
        return () => unsubscribe();
      }
    } catch (error) {
      console.error("Error al obtener los chats:", error);
      setError("No se pudieron cargar los chats.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", fetchChats);
    return unsubscribeFocus;
  }, [navigation]);

  const handleChatPress = (chatId: string, chatName: string) => {
    navigation.navigate("Chat", { chatId: chatId, chatName: chatName });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078FF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
        </View>
        <Text style={styles.subheader}>Mis chats</Text>

        {chats.length === 0 ? (
          <View style={styles.noChatsContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={60} color="#8E8E93" />
            <Text style={styles.noChatsText}>No tienes chats por el momento.</Text>
          </View>
        ) : (
          <ScrollView style={styles.chatList}>
            {chats.map((chat, index) => (
              <ChatListItem
                key={chat.id || `chat-${index}`}
                name={chat.displayName || "Desconocido"}
                lastMessage={chat.ultimoMensaje || "No hay mensajes"}
                time={chat.timestamp.toDate().toLocaleTimeString()}
                avatar={chat.avatar}
                isUnread={chat.isUnread || false} // Pasamos si está sin leer para mostrar un indicador visual
                onPress={() => chat.id && chat.displayName && handleChatPress(chat.id, chat.displayName)}
              />
            ))}
          </ScrollView>
        )}
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
    padding: 20,
    justifyContent: "center",
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    paddingLeft: 20,
    paddingVertical: 10,
    marginTop: 5,
  },
  chatList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#8E8E93",
    marginTop: 20,
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noChatsText: {
    fontSize: 18,
    color: "#8E8E93",
    marginTop: 20,
    textAlign: "center",
  },
});
