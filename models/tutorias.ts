import { Timestamp } from 'firebase/firestore';

export interface Tutoria {
    tutorId: string;
    tutorNombre: string;
    estudianteId: string;
    estudianteNombre: string;
    materiaId: string;
    materiaNombre: string;
    fechaCreacion: Timestamp;
    descripcion?: string;
    horario?: string;    
    plataforma?: string;
    enlaceAsesoria?: string;
  }
  