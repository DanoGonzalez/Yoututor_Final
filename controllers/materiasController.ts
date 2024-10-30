import { db } from '../utils/Firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
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