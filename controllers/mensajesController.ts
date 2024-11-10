import { db } from "../utils/Firebase";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Mensaje } from "../models/mensajes";


export const newMensaje = async (chatId: string, emisorId: string, mensaje: string): Promise<string> => {
    try {
        const mensajeData: Mensaje = {
        id: "",
        chatId,
        remitenteId: emisorId,
        mensaje,
        timestamp: new Date(),
        };
    
        const mensajeRef = await addDoc(collection(db, "mensajes"), mensajeData);
        mensajeData.id = mensajeRef.id;
    
        console.log("Mensaje creado:", mensajeRef.id);
    
        return mensajeRef.id;
    } catch (error) {
        console.error("Error al crear el mensaje:", error);
        throw new Error("No se pudo crear el mensaje");
    }
}