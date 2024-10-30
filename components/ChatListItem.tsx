import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  onPress: () => void;
}

export default function ChatListItem({
  name,
  lastMessage,
  time,
  avatar,
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
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage}
        </Text>
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
  time: {
    fontSize: 12,
    color: "#666",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
});
