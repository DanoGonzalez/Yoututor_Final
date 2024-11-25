import { Timestamp } from "firebase/firestore";

export interface Logs {
    usuarioId: string;
    nombreUsuario: string;
    accion: string;
    timestamp: Timestamp;
    mensaje: string;
    id?: string;    
}