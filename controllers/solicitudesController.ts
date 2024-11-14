// src/controllers/SolicitudController.ts
import { db } from '../utils/Firebase';
import { collection, addDoc, Timestamp, query, where, getDocs, getDoc, doc  } from 'firebase/firestore';
import { Solicitud } from '../models/solicitudes';
import { Usuario } from '../models/usuarios';
import { crearNotificacion } from './notificacionesController';

const solicitudesCollection = collection(db, 'solicitudes');
const usuariosCollection = collection(db, 'usuarios');

export const crearSolicitud = async (tutorId: string, estudianteId: string, materiaId: string) => {
  try {
    const nuevaSolicitud: Solicitud = {
      tutorId,
      estudianteId,
      materiaId,
      status: 0,
      fechaSolicitud: Timestamp.now(),
    };

    // Crear el documento de la solicitud en Firestore
    const docRef = await addDoc(solicitudesCollection, nuevaSolicitud);

    // Obtener los detalles del estudiante para incluir su nombre en el mensaje
    const estudianteDoc = await getDoc(doc(usuariosCollection, estudianteId));
    const estudianteData = estudianteDoc.exists() ? (estudianteDoc.data() as Usuario) : null;

    const estudianteNombre = estudianteData
      ? `${estudianteData.nombres} ${estudianteData.apellidos}`
      : "Nombre no disponible";

    // Crear notificación para el tutor con el nombre del estudiante en el mensaje
    const mensaje = `te ha enviado una solicitud para una tutoría.`;
    await crearNotificacion(tutorId, mensaje, 1, estudianteId, materiaId);

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