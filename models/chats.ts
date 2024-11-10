import { Timestamp } from "firebase/firestore";

export interface Chats {
    id: string;
    estudianteId: string;
    tutorId: string;
    ultimoMensaje: string;
    timestamp: Timestamp;
    mensajesCount: number;
  }
  