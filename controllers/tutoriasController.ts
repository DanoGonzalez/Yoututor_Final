import { db } from "../utils/Firebase";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Tutoria } from "../models/tutorias";
import { getUsuario } from "./usuariosController";
import {getMateriaTutoria } from "./materiasController";

const tutoriaData = collection(db, "tutorias");

export const crearTutoria = async (tutorId: string, estudianteId: string, materiaId: string): Promise<string> => {
    try {
      const constTutor = await getUsuario(tutorId);
      const constEstudiante = await getUsuario(estudianteId);
  
      const newTutoria: Tutoria = {
        tutorId: constTutor.id || '',
        tutorNombre: `${constTutor.nombres} ${constTutor.apellidos}`,
        estudianteId: constEstudiante.id || '',
        estudianteNombre: `${constEstudiante.nombres} ${constEstudiante.apellidos}`,
        materiaId:0 || '',
        materiaNombre: 0|| '',  // Usar la propiedad 'materia' correctamente
        fechaCreacion: Timestamp.now(),
      };
  
      const tutoriaRef = await addDoc(tutoriaData, newTutoria);
  
      console.log("Tutoría creada:", tutoriaRef.id);
      console.log("Datos de la tutoría guardados:", { id: tutoriaRef.id, ...newTutoria });
  
      return tutoriaRef.id;
    } catch (error) {
      console.error("Error al crear la tutoría:", error);
      throw new Error("No se pudo crear la tutoría");
    }
  };
  
