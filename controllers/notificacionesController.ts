// src/controllers/notificacionesController.ts
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../utils/Firebase'; // Asegúrate de importar correctamente tu configuración de Firebase
import { Notificacion } from '../models/notificaciones';

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