export interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  status: string;
  avatar: string;
  messages: Message[];
  lastMessage?: string;
  time?: string;
}

export const chatData: Record<string, Chat> = {
  "1": {
    id: "1",
    name: "José Ernesto",
    status: "En línea",
    avatar: "https://example.com/avatar1.jpg",
    messages: [],
  },
  "2": {
    id: "2",
    name: "Andy Castillo",
    status: "En línea",
    avatar: "https://example.com/avatar2.jpg",
    messages: [],
  },
}; 