import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  isUnread: boolean; // Añadir propiedad para saber si el mensaje está sin leer
  onPress: () => void;
}

export default function ChatListItem({
  name,
  lastMessage,
  time,
  avatar,
  isUnread,
  onPress,
}: ChatListItemProps) {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <Image
        source={
          avatar ? { uri: avatar } : require("../assets/icons/profile-picture.png")
        }
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.messageContainer}>
          {isUnread && <View style={styles.unreadDot} />}
          <Text style={[styles.lastMessage, isUnread && styles.unreadMessage]}>
            {lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  unreadMessage: {
    fontWeight: "bold",
    color: "#000", // Cambiar el color para resaltar el mensaje no leído
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0078FF",
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
});
