// src/models/Solicitud.ts
import { Timestamp } from 'firebase/firestore';

export interface Solicitud {
  id?: string;
  tutorId: string;
  estudianteId: string;
  materiaId: number;
  status: number;
  fechaSolicitud: Timestamp;
}
