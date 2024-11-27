import { db } from "../utils/Firebase";
import { collection, addDoc, Timestamp, query, where, doc, orderBy, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { Mensaje } from "../models/mensajes";

const chatcollection = collection(db, "chats");

export const newMensaje = async (chatId: string, emisorId: string, mensaje: string): Promise<string> => {
    try {
        const mensajeData: Mensaje = {
        id: "",
        chatId,
        remitenteId: emisorId,
        mensaje,
        timestamp: Timestamp.fromDate(new Date()),
        };
    
        const mensajeRef = await addDoc(collection(db, "mensajes"), mensajeData);
        const ultimoMensajeRef = doc(chatcollection, chatId);
        await updateDoc(ultimoMensajeRef, {
          ultimoMensaje: mensaje,
        });
        mensajeData.id = mensajeRef.id;
    
        console.log("Mensaje creado:", mensajeRef.id);
    
        return mensajeRef.id;
    } catch (error) {
        console.error("Error al crear el mensaje:", error);
        throw new Error("No se pudo crear el mensaje");
    }
}

export const getMensajes = async (chatId: string): Promise<Mensaje[]> => {
    try {
      const messagesRef = collection(db, "mensajes");
      const q = query(
        messagesRef,
        where("chatId", "==", chatId),
        orderBy("timestamp", "asc") // Asegúrate de que tengas el índice necesario en Firestore
      );
  
      const querySnapshot = await getDocs(q);
      const mensajes = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Mensaje),
        id: doc.id,
      }));
  
      return mensajes;
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
      throw new Error("No se pudieron obtener los mensajes");
    }
  };