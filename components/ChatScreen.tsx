import React from "react";
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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Definimos los datos de los chats (esto podría venir de una API o base de datos)
const chatData = {
  "1": {
    id: "1",
    name: "José Ernesto",
    status: "En línea",
    avatar: "https://example.com/avatar1.jpg",
  },
  "2": {
    id: "2",
    name: "Andy Castillo",
    status: "En línea",
    avatar: "https://example.com/avatar2.jpg",
  },
};

export default function ChatScreen({
  route,
}: {
  route: { params: { chatId: string } };
}) {
  const navigation = useNavigation();
  const { chatId } = route.params;
  const currentChat = chatData[chatId as keyof typeof chatData];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={require("../assets/icons/arrow.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{currentChat.name}</Text>
        </View>
      </View>

      {/* Chat Messages Area */}
      <View style={styles.messagesContainer}>{/* Aquí irán los mensajes */}</View>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton}>
          <Image
            source={require("../assets/icons/send.png")}
            style={styles.sendIcon}
          />
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
    padding: 16,
    backgroundColor: "#0078FF",
    height: 80,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  headerStatus: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
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
});
