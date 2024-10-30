// src/controllers/UsuarioController.ts
import { db } from '../utils/Firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { Usuario } from '../models/usuarios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const usuariosCollection = collection(db, 'usuarios');


export const getUsuarios = async () => {
  try {
    const querySnapshot = await getDocs(usuariosCollection);
    const usuarios: Usuario[] = [];
    querySnapshot.forEach((doc) => {
      usuarios.push({ id: doc.id, ...doc.data() } as Usuario);
    });
    return usuarios;
  } catch (error:any) {
    throw new Error('Error al obtener los usuarios: ' + error.message);
  }
};

export const updateUsuario = async (id: string, usuario: Partial<Usuario>) => {
  try {
    const usuarioDoc = doc(db, 'usuarios', id);
    await updateDoc(usuarioDoc, usuario);
    return { id, ...usuario };
  } catch (error:any) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
};

export const deleteUsuario = async (id: string) => {
  try {
    const usuarioDoc = doc(db, 'usuarios', id);
    await deleteDoc(usuarioDoc);
    return id;
  } catch (error:any) {
    throw new Error('Error al eliminar el usuario: ' + error.message);
  }
};

export const loginUsuario = async (correo: string, password: string) => {
    try {
      const q = query(usuariosCollection, where('correo', '==', correo), where('password', '==', password));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const usuarioData = querySnapshot.docs[0].data();
        return { id: querySnapshot.docs[0].id, ...usuarioData } as Usuario;
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error: any) {
      throw new Error('Error al iniciar sesión: ' + error.message);
    }
  };

  export const isUsuarioLogueado = async () => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      return usuario !== null;
    } catch (error: any) {
      throw new Error('Error al verificar el estado de la sesión: ' + error.message);
    }
  };

  export const createStudents = async (usuario: Partial<Usuario>) => {
    try {
      const newUser: Usuario = {
        ...usuario,
        role: 2,
        status: 1,
        statusExam: 0,
        tecnologias: [],
        materiasDominadas: [],
        descripcion: '',
        createdAt: Timestamp.now(),
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        password: usuario.password || '',
      };
  
      const docRef = await addDoc(usuariosCollection, newUser);
      return { id: docRef.id, ...newUser };
    } catch (error: any) {
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  };
  
  
  export const createTutor = async (usuario: Partial<Usuario>) => {
    try {
      const newUser: Usuario = {
        ...usuario,
        role: 3,
        status: 0,
        statusExam: 0,
        tecnologias: [],
        materiasDominadas: [],
        descripcion: '',
        createdAt: Timestamp.now(),
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        password: usuario.password || '',
      };
  
      const docRef = await addDoc(usuariosCollection, newUser);
      return { id: docRef.id, ...newUser };
    } catch (error: any) {
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  };  