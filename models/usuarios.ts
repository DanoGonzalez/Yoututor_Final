// src/models/Usuario.ts
import { Timestamp } from 'firebase/firestore';

export interface Usuario {
  id?: string;
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
  role: number;
  status: number;
  statusExam: number;
  tecnologias: string[];
  materiasDominadas: string[];
  descripcion: string;
  createdAt: Timestamp;
}