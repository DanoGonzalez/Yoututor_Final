import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import ChatListItem from "./ChatListItem";
import { RootStackParamList } from "../types";
import { chatData, Chat } from "../utils/chatData";

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
          <Text style={styles.title}>Mensajes</Text>
        </View>
        <ScrollView style={styles.chatList}>
          {chatList.map((chat) => (
            <ChatListItem
              key={chat.id}
              name={chat.name}
              lastMessage={chat.lastMessage}
              time={chat.time}
              avatar={chat.avatar}
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
    backgroundColor: "#0078FF",
    padding: 20,
    paddingTop: StatusBar.currentHeight || 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  chatList: {
    flex: 1,
  },
});
