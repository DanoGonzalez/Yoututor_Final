import { db } from "../utils/Firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { Materia } from "../models/materias";
import AsyncStorage from "@react-native-async-storage/async-storage";
const materiasCollection = collection(db, "materias");
const counterDoc = doc(db, "counters", "materias");

export const getmaterias = async () => {
  try {
    console.log("Intentando obtener materias...");
    const querySnapshot = await getDocs(materiasCollection);
    const materias: Materia[] = [];
    querySnapshot.forEach((doc) => {
      console.log("Documento encontrado:", doc.id, doc.data());
      materias.push({ id: doc.id, ...doc.data() } as Materia);
    });
    console.log("Total materias encontradas:", materias.length);
    return materias;
  } catch (error: any) {
    console.error("Error completo:", error);
    throw new Error("Error al obtener las materias: " + error.message);
  }
};

export const getMateria = async (id: string): Promise<Materia> => {
  try {
    const materiaDoc = doc(db, "materias", id);
    const materiaSnapshot = await getDoc(materiaDoc);
    if (materiaSnapshot.exists()) {
      return { id: materiaSnapshot.id, ...materiaSnapshot.data() } as Materia;
    } else {
      throw new Error("Materia no encontrada");
    }
  } catch (error: any) {
    throw new Error("Error al obtener la materia: " + error.message);
  }
};

export const getMateriaTutoria = async (id: string): Promise<Materia> => {
  try {
    // Acceder al documento de la materia en Firestore
    const materiaDoc = doc(db, "materias", id);
    const materiaSnapshot = await getDoc(materiaDoc);

    // Verificar si el documento existe
    if (materiaSnapshot.exists()) {
      const data = materiaSnapshot.data();

      // Verificar que la propiedad 'materia' exista en los datos
      if (!data || !data.materia) {
        throw new Error(
          'Materia no válida: la propiedad "materia" no está definida.'
        );
      }

      // Retornar la materia con su ID y nombre
      return { id: materiaSnapshot.id, ...data } as Materia;
    } else {
      throw new Error("Materia no encontrada");
    }
  } catch (error: any) {
    console.error("Error al obtener la materia:", error.message);
    throw new Error("Error al obtener la materia: " + error.message);
  }
};

export const addMateria = async (nombre: string) => {
  try {
    // Obtener todas las materias existentes
    const querySnapshot = await getDocs(materiasCollection);
    let maxId = 0;

    // Encontrar el ID más alto actual
    querySnapshot.forEach((doc) => {
      const currentId = parseInt(doc.id);
      if (!isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    });

    // El nuevo ID será el máximo actual + 1
    const nextId = (maxId + 1).toString();

    // Crear el nuevo documento
    const newMateria = {
      materia: nombre,
      descripcion: "",
      url: "",
    };

    // Usar el nuevo ID
    await setDoc(doc(materiasCollection, nextId), newMateria);

    return { id: nextId, ...newMateria };
  } catch (error: any) {
    throw new Error("Error al agregar la materia: " + error.message);
  }
};