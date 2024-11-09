// src/controllers/notificacionesController.ts
import { addDoc, collection, Timestamp, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../utils/Firebase'; // Asegúrate de importar correctamente tu configuración de Firebase
import { Notificacion } from '../models/notificaciones';
import { Usuario } from "../models/usuarios";

const usuariosCollection = collection(db, "usuarios");
const notificacionesCollection = collection(db, 'notificaciones');

export const crearNotificacion = async (receptorId: string, mensaje: string, tipo: number, solicitanteId: string) => {
  try {
    const nuevaNotificacion: Notificacion = {
      receptorId,
      solicitanteId,
      mensaje,
      leido: false,
      fechaEnvio: Timestamp.now(),
      tipo,
    };

    const docRef = await addDoc(notificacionesCollection, nuevaNotificacion);
    return { id: docRef.id, ...nuevaNotificacion };
  } catch (error: any) {
    throw new Error('Error al crear la notificación: ' + error.message);
  }
};


export const getNotificaciones = async (receptorId: string) => {
  try {
    // 1. Obtener las notificaciones donde receptorId coincide
    const querySnapshot = await getDocs(
      query(notificacionesCollection, where("receptorId", "==", receptorId))
    );

    // 2. Mapea las notificaciones y obtén el usuario para cada estudianteId
    const notificaciones = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data() as Notificacion;
        const estudianteId = data.solicitanteId;

        // 3. Buscar los detalles del estudiante
        const estudianteDoc = await getDoc(doc(usuariosCollection, estudianteId));
        const estudianteData = estudianteDoc.exists()
          ? (estudianteDoc.data() as Usuario)
          : null;

        return {
          id: docSnapshot.id,
          ...data,
          estudianteNombre: estudianteData ? `${estudianteData.nombres} ${estudianteData.apellidos}` : "Nombre no disponible",
        };
      })
    );

    return notificaciones;
  } catch (error: any) {
    throw new Error("Error al obtener las notificaciones: " + error.message);
  }
};