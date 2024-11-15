import { db } from "../utils/Firebase";
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { Chats } from "../models/chats";
import { getUsuario } from "./usuariosController";

// Referencia a la colección de chats
const chatData = collection(db, "chats");

export const newChat = async (estudianteId: string, tutorId: string, tutoriaId: string): Promise<string> => {
  try {
    const newChat: Chats = {
      estudianteId,
      tutorId,
      tutoriaId,
      ultimoMensaje: "",
      timestamp: Timestamp.now(),
      mensajesCount: 0,
    };

    const chatRef = await addDoc(chatData, newChat);

    console.log("Chat creado:", chatRef.id);


    return chatRef.id;
  } catch (error) {
    console.error("Error al crear el chat:", error);
    throw new Error("No se pudo crear el chat");
  }
}


export const getChatEstudiante = async (estudianteId: string) => {
  try {
    // Consulta los chats donde el estudianteId coincida
    const querySnapshot = await getDocs(
      query(chatData, where("estudianteId", "==", estudianteId))
    );

    // Para cada chat, obtén los datos del estudiante y tutor
    const chats = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as Chats;
        const tutorId = data.tutorId;

        // Obtiene la información del estudiante y tutor
        const estudiante = await getUsuario(estudianteId);
        const tutor = await getUsuario(tutorId);

        return {
          id: doc.id,
          ...data,
          estudianteInfo: estudiante,
          tutorInfo: tutor
        };
      })
    );

    return chats;
  } catch (error) {
    throw new Error("No se pudieron obtener los chats");
  }
};


export const getChatTutor = async (tutorId: string) => {
  try {
    // Consulta los chats donde el estudianteId coincida
    const querySnapshot = await getDocs(
      query(chatData, where("tutorId", "==", tutorId))
    );

    // Para cada chat, obtén los datos del estudiante y tutor
    const chats = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as Chats;
        const estudianteId = data.estudianteId;

        // Obtiene la información del estudiante y tutor
        const estudiante = await getUsuario(estudianteId);
        const tutor = await getUsuario(tutorId);

        return {
          id: doc.id,
          ...data,
          estudianteInfo: estudiante,
          tutorInfo: tutor
        };
      })
    );

    return chats;
  } catch (error) {
    throw new Error("No se pudieron obtener los chats");
  }
};