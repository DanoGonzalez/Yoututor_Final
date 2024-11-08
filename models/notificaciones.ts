import { Timestamp } from 'firebase/firestore';

export interface Notificacion {
  id?: string;
  receptorId: string;
  mensaje: string;
  leido: boolean;
  fechaEnvio: Timestamp;
  tipo: number;
}