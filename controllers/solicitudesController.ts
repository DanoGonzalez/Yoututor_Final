// src/controllers/SolicitudController.ts
import { db } from '../utils/Firebase';
import { collection, addDoc, Timestamp, query, where, getDocs  } from 'firebase/firestore';
import { Solicitud } from '../models/solicitudes';
import { crearNotificacion } from './notificacionesController';

const solicitudesCollection = collection(db, 'solicitudes');

export const crearSolicitud = async (tutorId: string, estudianteId: string, materiaId: number) => {
  try {
    const nuevaSolicitud: Solicitud = {
      tutorId,
      estudianteId,
      materiaId,
      status: 0,
      fechaSolicitud: Timestamp.now(),
    };

    const docRef = await addDoc(solicitudesCollection, nuevaSolicitud);

    // Crear notificación para el tutor con estudianteId como solicitanteId
    const mensaje = `El estudiante ${estudianteId} te ha enviado una solicitud.`;
    await crearNotificacion(tutorId, mensaje, 1, estudianteId); // Pasamos estudianteId como solicitanteId

    return { id: docRef.id, ...nuevaSolicitud };
  } catch (error: any) {
    throw new Error('Error al crear la solicitud: ' + error.message);
  }
};


export const verificarSolicitudPendiente = async (tutorId: string, estudianteId: string) => {
  try {
    const q = query(
      solicitudesCollection,
      where('tutorId', '==', tutorId),
      where('estudianteId', '==', estudianteId),
      where('status', '==', 0)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error: any) {
    console.error('Error al verificar la solicitud pendiente:', error);
    throw new Error('Error al verificar la solicitud pendiente');
  }
};