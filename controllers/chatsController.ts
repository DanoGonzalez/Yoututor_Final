import { db } from "../utils/Firebase";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Chats } from "../models/chats";

// Referencia a la colección de chats
const chatData = collection(db, "chats");

export const newChat = async (estudianteId: string, tutorId: string): Promise<string> => {
  try {
    const newChat: Chats = {
      id: "",
      estudianteId,
      tutorId,
      ultimoMensaje: "",
      timestamp: Timestamp.now(),
      mensajesCount: 0,
    };

    const chatRef = await addDoc(chatData, newChat);
    newChat.id = chatRef.id;

    console.log("Chat creado:", chatRef.id);


    return chatRef.id;
  } catch (error) {
    console.error("Error al crear el chat:", error);
    throw new Error("No se pudo crear el chat");
  }
}
