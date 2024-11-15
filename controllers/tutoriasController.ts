import { db } from "../utils/Firebase";
import { collection, addDoc, Timestamp, getDocs, query, where, getDoc, doc, updateDoc, onSnapshot  } from 'firebase/firestore';
import { Tutoria } from "../models/tutorias";
import { getUsuario } from "./usuariosController";
import {getMateriaTutoria } from "./materiasController";
import { updateNotificacion } from "./notificacionesController";
import { newChat } from "./chatsController";
import { crearNotificacion } from "./notificacionesController";

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
      const mensaje = `ha aceptado la solicitud para la materia ${constMateria.materia}`;
      await crearNotificacion(estudianteId, mensaje, 2, tutorId , materiaId);

      await updateNotificacion(NotifiacionId);

      
      const tutoriaRef = await addDoc(tutoriaData, newTutoria);
      const chatId = await newChat(estudianteId, tutorId,tutoriaRef.id );

      return tutoriaRef.id;
    } catch (error) {
      console.error("Error al crear la tutoría:", error);
      throw new Error("No se pudo crear la tutoría");
    }
  };
  

  export const getTutorias = (estudianteId: string, callback: (tutorias: Tutoria[]) => void) => {
    console.log("Buscando tutorías del estudiante en tiempo real:", estudianteId);
  
    try {
      const tutoriaQuery = query(
        collection(db, "tutorias"),
        where("estudianteId", "==", estudianteId)
      );
  
      // Listener en tiempo real
      const unsubscribe = onSnapshot(tutoriaQuery, (querySnapshot) => {
        const tutorias = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Tutoria;
          return { id: doc.id, ...data };
        });
  
        // Llama al callback con los datos actualizados
        callback(tutorias);
      });
  
      // Retorna la función de desuscripción para limpiar el listener
      return unsubscribe;
    } catch (error) {
      throw new Error("No se pudieron obtener las tutorías en tiempo real");
    }

  }


  export const getTutoriasbyid = async (id: string) => {
    console.log("Buscando tutorías del estudiante:", id);
    try {
      const tutoriaDoc = doc(tutoriaData, id);
      const tutoriaSnapshot = await getDoc(tutoriaDoc);
      if (tutoriaSnapshot.exists()) {
        const data = tutoriaSnapshot.data();
        const tutor = await getUsuario(data?.tutorId || '');
        const estudiante = await getUsuario(data?.estudianteId || '');
        return {
          id: tutoriaSnapshot.id,
          tutorId: data?.tutorId || '',
          tutorNombre: data?.tutorNombre || '',
          estudianteId: data?.estudianteId || '',
          estudianteNombre: data?.estudianteNombre || '',
          materiaId: data?.materiaId || '',
          materiaNombre: data?.materiaNombre || '',
          fechaCreacion: data?.fechaCreacion || Timestamp.now(),
          descripcion: data?.descripcion || '',
          horario: data?.horario || '',
          plataforma: data?.plataforma || '',
          enlaceAsesoria: data?.enlaceAsesoria || '',
          tutorData: tutor,
          estudianteData: estudiante,
        } as Tutoria;
     
        
      } else {
        throw new Error('Tutoria no encontrada');
      }
    }
    catch (error: any) {
      throw new Error('Error al obtener el usuario: ' + error.message);
    }
  }


  export const updateTutoria = async (id: string, updates: Partial<Tutoria>) => {
    try {
      console.log("Actualizando tutoría:", id, updates);
      const tutoriaRef = doc(db, 'tutorias', id);
      await updateDoc(tutoriaRef, updates);
      console.log("Tutoria actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la tutoría:", error);
      throw new Error("No se pudo actualizar la tutoría");
    }

  };