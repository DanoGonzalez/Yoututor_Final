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
import { chatData } from "../utils/chatData";
import { getChatEstudiante } from "../controllers/chatsController";
import Icon from "react-native-vector-icons/FontAwesome"; // Importa los íconos

export default function MessagesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [chatList, setChatList] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const updatedChats = Object.values(chatData).map((chat) => ({
        id: chat.id,
        name: chat.name,
        lastMessage:
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].text
            : "No hay mensajes",
        time:
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].timestamp
            : "",
        avatar: chat.avatar,
      }));
      setChatList(updatedChats);
    });

    return unsubscribe;
  }, [navigation]);

  const handleChatPress = (chatId: string) => {
    navigation.navigate("Chat", { chatId: chatId });
  };

  return (
    <>
      <StatusBar backgroundColor="#0078FF" barStyle="light-content" />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.leftSection}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Chats</Text>
        </View>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor="#8E8E93"
          />
        </View>
        <Text style={styles.subheader}>Mis chats</Text>
        <ScrollView style={styles.chatList}>
          {chatList.map((chat) => (
            <ChatListItem
              key={chat.id}
              name={chat.name}
              lastMessage={chat.lastMessage}
              time={chat.time}
              avatar={chat.avatar} // Pasamos el avatar que puede ser undefined
              onPress={() => handleChatPress(chat.id)}
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
    fontSize: 17, // Tamaño de letra más pequeño
    fontWeight: "600",
    color: "#000000",
    paddingLeft: 20,
    paddingVertical: 10,
    marginTop: 5, // Espaciado adicional para separarlo
  },
  chatList: {
    flex: 1,
  },
});
