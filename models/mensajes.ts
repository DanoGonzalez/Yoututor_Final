import { Timestamp } from "firebase/firestore";

export interface Mensaje {
    id: string;
    chatId: string;
    remitenteId: string;
    mensaje: string;
    timestamp: Timestamp;
}   