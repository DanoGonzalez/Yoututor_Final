import { db } from '../utils/Firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { Materia } from '../models/materias';
import AsyncStorage from '@react-native-async-storage/async-storage';
const materiasCollection = collection(db, 'materias');

export const getmaterias = async () => {
    try {
        const querySnapshot = await getDocs(materiasCollection);
        const materias: Materia[] = [];
        querySnapshot.forEach((doc) => {
        materias.push({ id: doc.id, ...doc.data() } as Materia);
        console.log(materias);
        });
        return materias;
    } catch (error:any) {
        throw new Error('Error al obtener los materias: ' + error.message);
    }
}

export const getMateria = async (id: string): Promise<Materia> => {
    try {
      const materiaDoc = doc(db, 'materias', id);
      const materiaSnapshot = await getDoc(materiaDoc);
      if (materiaSnapshot.exists()) {
        return { id: materiaSnapshot.id, ...materiaSnapshot.data() } as Materia;
      } else {
        throw new Error('Materia no encontrada');
      }
    } catch (error: any) {
      throw new Error('Error al obtener la materia: ' + error.message);
    }
  };

  export const getMateriaTutoria = async (id: string): Promise<Materia> => {
    try {
      // Acceder al documento de la materia en Firestore
      const materiaDoc = doc(db, 'materias', id);
      const materiaSnapshot = await getDoc(materiaDoc);
  
      // Verificar si el documento existe
      if (materiaSnapshot.exists()) {
        const data = materiaSnapshot.data();
  
        // Verificar que la propiedad 'materia' exista en los datos
        if (!data || !data.materia) {
          throw new Error('Materia no válida: la propiedad "materia" no está definida.');
        }
  
        // Retornar la materia con su ID y nombre
        return { id: materiaSnapshot.id, ...data } as Materia;
      } else {
        throw new Error('Materia no encontrada');
      }
    } catch (error: any) {
      console.error('Error al obtener la materia:', error.message);
      throw new Error('Error al obtener la materia: ' + error.message);
    }
  };
  