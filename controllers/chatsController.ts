import { db } from "../utils/Firebase";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Chat } from "../models/chats";

// Referencia a la colección de chats
const chatData = collection(db, "chats");

export const crearChat = async (chat: Chat): Promise<string> => {
  try {
    const chatRef = await addDoc(chatData, {
      ...chat,
      fechaCreacion: Timestamp.fromDate(new Date()) 
    });
    console.log("Chat creado:", chatRef.id);
    return chatRef.id;
  } catch (error) {
    console.error("Error al crear el chat:", error);
    throw new Error("No se pudo crear el chat");
  }
};
