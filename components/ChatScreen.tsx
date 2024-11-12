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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { chatData, Message } from "../utils/chatData";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";

export default function ChatScreen({
  route,
}: {
  route: { params: { chatId: string } };
}) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { chatId } = route.params;
  const currentChat = chatData[chatId as keyof typeof chatData];
  const [inputMessage, setInputMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>(currentChat.messages);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    chatData[chatId as keyof typeof chatData].messages = updatedMessages;
    
    setInputMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{currentChat.name}</Text>
      </View>

      {/* Área de Mensajes */}
      <View style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === "user" ? styles.userMessage : styles.otherMessage,
            ]}>
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageTime}>{message.timestamp}</Text>
          </View>
        ))}
      </View>

      {/* Área de Entrada */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          multiline
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10, // Espacio entre el icono y el texto
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
    backgroundColor: "#E8E8E8",
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.7,
    marginTop: 4,
    alignSelf: "flex-end",
  },
});
