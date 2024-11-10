import { Timestamp } from 'firebase/firestore';

export interface Notificacion {
  id?: string;
  receptorId: string;
  solicitanteId: string;
  mensaje: string;
  leido: boolean;
  fechaEnvio: Timestamp;
  tipo: number;
  estudianteNombre?: string;
  materiaId: string;
}