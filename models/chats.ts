import { Timestamp } from "firebase/firestore";

export interface Chats {
    estudianteId: string;
    tutorId: string;
    ultimoMensaje: string;
    timestamp: Timestamp;
    mensajesCount: number;
    displayName?: string;
    avatar?: string;
    id?: string;
  }
  