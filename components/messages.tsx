import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import ChatListItem from "./ChatListItem";
import { RootStackParamList } from "../types";
import { getChatEstudiante, getChatTutor } from "../controllers/chatsController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chats } from "../models/chats"; // Importamos la nueva interfaz ChatData

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
      const usuarioId = usuario.id;
      const usuarioRol = usuario.role;
      console.log("role", usuarioRol);

      let chatsData: Chats[] = [];
      if (usuarioId && usuarioRol === 2) {
        // Chat de estudiantes: mostrar nombre del tutor
        const chatEstudiante = await getChatEstudiante(usuarioId);
        chatsData = chatEstudiante.map((chat) => ({
          ...chat,
          id: chat.id,
          avatar: chat.tutorInfo.profilePicture, // Usar avatar del tutor
          displayName: chat.tutorInfo.nombres, // Mostrar nombre del tutor
        }));
      } else if (usuarioId && usuarioRol === 3) {
        // Chat de tutores: mostrar nombre del estudiante
        const chatTutor = await getChatTutor(usuarioId);
        chatsData = chatTutor.map((chat) => ({
          ...chat,
          id: chat.id,
          avatar: chat.estudianteInfo.profilePicture,
          displayName: chat.estudianteInfo.nombres, // Mostrar nombre del estudiante
        }));
      }

      setChats(chatsData);
    } catch (error) {
      console.error("Error al obtener los chats:", error);
      setError("No se pudieron cargar los chats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchChats);
    return unsubscribe;
  }, [navigation]);

  const handleChatPress = (chatId: string, chatName: string) => {
    navigation.navigate("Chat", { chatId: chatId, chatName: chatName });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando chats...</Text>;
  }

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor="#8E8E93"
          />
        </View>
        <Text style={styles.subheader}>Mis chats</Text>
        <ScrollView style={styles.chatList}>
          {chats.map((chat, index) => (
            <ChatListItem
              key={chat.id || `chat-${index}`} // Usa un key provisional si chat.id es nulo o undefined
              name={chat.displayName || "Desconocido"}
              lastMessage={chat.ultimoMensaje || "No hay mensajes"}
              time={chat.timestamp.toDate().toLocaleTimeString()}
              avatar={chat.avatar}
              onPress={() => chat.id && chat.displayName && handleChatPress(chat.id, chat.displayName)}
            />
          ))}
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
    padding: 20,
    justifyContent: "center",
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  leftSection: {
    position: "absolute",
    left: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
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
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#f1f1f1",
    marginTop: 20,
  },
});
