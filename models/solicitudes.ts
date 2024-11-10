// src/models/Solicitud.ts
import { Timestamp } from 'firebase/firestore';

export interface Solicitud {
  id?: string;
  tutorId: string;
  estudianteId: string;
  materiaId: string;
  status: number;
  fechaSolicitud: Timestamp;
}
