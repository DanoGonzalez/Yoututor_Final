import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../utils/Firebase";
import { getMensajes, newMensaje } from "../controllers/mensajesController";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mensaje } from "../models/mensajes";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

export default function ChatScreen({ route }: { route: ChatScreenRouteProp }) {
  const navigation = useNavigation();
  const { chatId } = route.params;
  const { chatName } = route.params;
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [userId, setUserId] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);

  // Obtener el ID del usuario actual
  useEffect(() => {
    const getUserId = async () => {
      const userData = await AsyncStorage.getItem("usuario");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
      }
    };
    getUserId();
  }, []);

  // Cargar mensajes iniciales y configurar listener en tiempo real
  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const mensajes = await getMensajes(chatId);
        setMessages(mensajes);
      } catch (error) {
        console.error("Error al cargar los mensajes:", error);
      }
    };

    fetchMensajes();

    // Configurar listener en tiempo real
    const messagesRef = collection(db, "mensajes");
    const q = query(
      messagesRef,
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Mensaje[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    try {
      await newMensaje(chatId, userId, inputMessage);
      setInputMessage(""); // Limpiar el campo de entrada después de enviar el mensaje
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{chatName}</Text>
      </View>

      {/* Área de Mensajes */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View
            key={message.id || `message-${index}`} // Usa `index` si `message.id` no está definido
            style={[
              styles.messageWrapper,
              message.remitenteId === userId ? styles.userMessage : styles.otherMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                { color: message.remitenteId === userId ? "#FFFFFF" : "#000000" }, // Texto blanco para el usuario, negro para el otro
              ]}
            >{message.mensaje}
            </Text>
            <Text style={styles.messageTime}>
              {message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </Text>


          </View>
        ))}
      </ScrollView>

      {/* Área de Entrada */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          multiline
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Image source={require("../assets/icons/send.png")} style={styles.sendIcon} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
  },
  backButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0078FF",
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  messageWrapper: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0078FF",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#D3D3D3", // Cambia el color de fondo del mensaje recibido
  },
  messageText: {
    color: "#000000", // Cambia el color del texto para mayor visibilidad
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#000000", // Cambia el color del tiempo para mayor visibilidad
    opacity: 0.7,
    marginTop: 4,
    alignSelf: "flex-end",
  },
});
