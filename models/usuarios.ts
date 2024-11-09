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
  statusExam: number | null;
  tecnologias: string[];
  materiasDominadas: string[];
  descripcion: string;
  createdAt: Timestamp;
  profilePicture?: string;
  githubProfile?: string;
  linkedinProfile?: string;
}



export interface TutorWithMaterias {
  id?: string;
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
  role: number;
  status: number;
  statusExam: number | null;
  tecnologias: string[];
  descripcion: string;
  createdAt: Timestamp;
  materiasDominadas: { id: string; materia: string }[]; 
}

