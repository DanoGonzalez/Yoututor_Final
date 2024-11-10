import { db } from "../utils/Firebase";
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { Tutoria } from "../models/tutorias";
import { getUsuario } from "./usuariosController";
import {getMateriaTutoria } from "./materiasController";
import { updateNotificacion } from "./notificacionesController";
import { newChat } from "./chatsController";


const tutoriaData = collection(db, "tutorias");

export const crearTutoria = async (tutorId: string, estudianteId: string, materiaId: string, NotifiacionId: string): Promise<string> => {
    try {
      const constTutor = await getUsuario(tutorId);
      const constEstudiante = await getUsuario(estudianteId);
      const constMateria = await getMateriaTutoria(materiaId);
        
      const newTutoria: Tutoria = {
        tutorId: constTutor.id || '',
        tutorNombre: `${constTutor.nombres} ${constTutor.apellidos}`,
        estudianteId: constEstudiante.id || '',
        estudianteNombre: `${constEstudiante.nombres} ${constEstudiante.apellidos}`,
        materiaId:constMateria.id || '',
        materiaNombre: constMateria.materia || '',
        fechaCreacion: Timestamp.now(),
      };
      
      await updateNotificacion(NotifiacionId);
      const chatId = await newChat(estudianteId, tutorId);
      const tutoriaRef = await addDoc(tutoriaData, newTutoria);

      return tutoriaRef.id;
    } catch (error) {
      console.error("Error al crear la tutoría:", error);
      throw new Error("No se pudo crear la tutoría");
    }
  };
  

  export const getTutorias = async (estudianteId: string) => {
    console.log("Buscando tutorías del estudiante:", estudianteId);
    try {
      const querySnapshot = await getDocs(
        query(tutoriaData, where("estudianteId", "==", estudianteId))
      );
  
      const tutorias = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Tutoria;
        return { id: doc.id, ...data };
      });
      
      return tutorias;
    } catch (error) {
      throw new Error("No se pudieron obtener las tutorías");
    }
  }