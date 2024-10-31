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
import { chatData, Message } from "../utils/chatData";

export default function ChatScreen({
  route,
}: {
  route: { params: { chatId: string } };
}) {
  const navigation = useNavigation();
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

      {/* Input Area */}
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
  messageWrapper: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 8,
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
  },
});
