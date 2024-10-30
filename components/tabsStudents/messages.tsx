import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import ChatListItem from "../ChatListItem";
import { RootStackParamList } from "../../types";

export default function MessagesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const chats = [
    {
      id: "1",
      name: "José Ernesto",
      lastMessage: "¿Cuándo podemos agendar la tutoría?",
      time: "10:30",
      avatar: "https://example.com/avatar1.jpg",
    },
    {
      id: "2",
      name: "Andy Castillo",
      lastMessage: "Gracias por la clase de hoy",
      time: "09:15",
      avatar: "https://example.com/avatar2.jpg",
    },
  ];

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
          {chats.map((chat) => (
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
