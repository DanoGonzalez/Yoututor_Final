import { db } from '../utils/Firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { Usuario } from '../models/usuarios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const usuariosCollection = collection(db, 'usuarios');
import { getMateria } from './materiasController';
import { imageToBase64 } from '../utils/imageUtils';


export const createNewLog = async (usuarioId: string, nombreUsuario: string, accion: string, mensaje: string) => {
  try {
    const newLog = {
      usuarioId,
      nombreUsuario,
      accion,
      mensaje,
      timestamp: Timestamp.now(),
    };
    await addDoc(collection(db, 'logs'), newLog);
  } catch (error: any) {
    throw new Error('Error al crear el log: ' + error.message);
  }
}



