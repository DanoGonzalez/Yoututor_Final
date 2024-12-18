// src/controllers/UsuarioController.ts
import { db } from '../utils/Firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { Usuario } from '../models/usuarios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const usuariosCollection = collection(db, 'usuarios');
import { getMateria } from './materiasController';
import { imageToBase64 } from '../utils/imageUtils';
import { crearNotificacion } from './notificacionesController';


/*Obtenemos todos los usaurios */

export const getUsuarios = async () => {
  try {
    const querySnapshot = await getDocs(usuariosCollection);
    const usuarios: Usuario[] = [];
    querySnapshot.forEach((doc) => {
      usuarios.push({ id: doc.id, ...doc.data() } as Usuario);
    });
    return usuarios;
  } catch (error: any) {
    throw new Error('Error al obtener los usuarios: ' + error.message);
  }
};

export const getTutor = async (id: string) => {
  try {
    const usuarioDoc = doc(db, 'usuarios', id);
    const usuarioSnapshot = await getDoc(usuarioDoc);
    if (usuarioSnapshot.exists()) {
      const usuario = { id: usuarioSnapshot.id, ...usuarioSnapshot.data() } as Usuario;
      const materiasDominadas = await Promise.all(
        usuario.materiasDominadas.map(async (materiaId) => {
          const materia = await getMateria(materiaId);
          return { id: materiaId, materia: materia.materia }; 
        })
      );
      return { ...usuario, materiasDominadas };
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error: any) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
};
/*Obtenemos todos los tutores con un rol 3, status 1 y statusExam 1 */

export const getTutores = async () => {
  try {
    console.log('Obteniendo tutores...');
    const q = query(
      usuariosCollection,
      where('role', '==', 3),
      where('status', '==', 1),
      where('statusExam', '==', 1)
    );

    const querySnapshot = await getDocs(q);
    const tutores: Usuario[] = [];

    for (const doc of querySnapshot.docs) {
      const tutor = { id: doc.id, ...doc.data() } as Usuario;
      const materiasDominadas = await Promise.all(
        tutor.materiasDominadas.map(async (materiaId) => {
          const materia = await getMateria(materiaId);
          return materia.materia;
        })
      );
      tutores.push({ ...tutor, materiasDominadas });
    }

    return tutores;
  } catch (error: any) {
    throw new Error('Error al obtener los tutores: ' + error.message);
  }
};

/*Funcion para actualizar usuario *Seria modiciar esto para el editar perfil */

export const updateUsuario = async (id: string, usuario: Partial<Usuario>) => {
  try {
    const usuarioDoc = doc(db, 'usuarios', id);
    await updateDoc(usuarioDoc, usuario);
    return { id, ...usuario };
  } catch (error: any) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
};


/*Funcion apra login */

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

/*Funcion par avalidar si el suario tiene una sesion iniciada */

export const isUsuarioLogueado = async () => {
  try {
    const usuario = await AsyncStorage.getItem('usuario');
    return usuario !== null;
  } catch (error: any) {
    throw new Error('Error al verificar el estado de la sesión: ' + error.message);
  }
};

/*Funcion para crear al estudiante */

export const createStudents = async (usuario: Partial<Usuario>) => {
  try {
    const newUser: Usuario = {
      ...usuario,
      role: 2,
      status: 1,
      statusExam: null,
      tecnologias: [],
      materiasDominadas: [],
      descripcion: '',
      createdAt: Timestamp.now(),
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      correo: usuario.correo || '',
      password: usuario.password || '',
      profilePicture: usuario.profilePicture || '',
    };

    const docRef = await addDoc(usuariosCollection, newUser);
    return { id: docRef.id, ...newUser };
  } catch (error: any) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};

/*Funcion para crear al tutor */

export const createTutor = async (usuario: Partial<Usuario>) => {
  console.log('Creando tutor...');
  console.log('Usuario:', usuario);
  try {
    const newUser: Usuario = {
      ...usuario,
      role: 3,
      status: 0,
      statusExam: 0,
      tecnologias: [],
      materiasDominadas: usuario.materiasDominadas || [], 
      descripcion: '',
      createdAt: Timestamp.now(),
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      correo: usuario.correo || '',
      password: usuario.password || '',
      githubProfile: usuario.githubProfile || '',
      linkedinProfile: usuario.linkedinProfile || '',
      profilePicture: usuario.profilePicture || '',
    };

    const docRef = await addDoc(usuariosCollection, newUser);
    return { id: docRef.id, ...newUser };
  } catch (error: any) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};

/*Obtenemos la informacion del usuario con su parametro id */

export const getUsuario = async (id: string) => {
  try {
    const usuarioDoc = doc(db, 'usuarios', id);
    const usuarioSnapshot = await getDoc(usuarioDoc);
    if (usuarioSnapshot.exists()) {
      return { id: usuarioSnapshot.id, ...usuarioSnapshot.data() } as Usuario;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error: any) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
}



/*Get para obtener tutores pendientes */

export const getTutorPendientes = async () => {
  try {
    const q = query(
      usuariosCollection,
      where('role', '==', 3),
      where('status', '==', 0),
      where('statusExam', '==', 0)
    );

    const querySnapshot = await getDocs(q);
    const tutores: Usuario[] = [];

    for (const doc of querySnapshot.docs) {
      const tutor = { id: doc.id, ...doc.data() } as Usuario;
      const materiasDominadas = await Promise.all(
        tutor.materiasDominadas.map(async (materiaId) => {
          const materia = await getMateria(materiaId);
          return materia.materia;
        })
      );
      tutores.push({ ...tutor, materiasDominadas });
    }

    return tutores;
  } catch (error: any) {
    throw new Error('Error al obtener los tutores pendientes: ' + error.message);
  }
}

/*Aceptar tutor */

export const acceptTutor = async (tutorId: string) => {
  try {
    const tutorDoc = doc(db, 'usuarios', tutorId);
    await updateDoc(tutorDoc, { status: 1, statusExam: 1 });
    await crearNotificacion(tutorId, '¡Felicidades! Tu solicitud ha sido aceptada.', 4, tutorId, '');
  } catch (error: any) {
    throw new Error('Error al aceptar al tutor: ' + error.message);
  }
}


export const rejectTutor = async (tutorId: string) => {
  try {
    const tutorDoc = doc(db, 'usuarios', tutorId);
    await updateDoc(tutorDoc, { status: 5})
    await crearNotificacion(tutorId, 'Tu solicitud ha sido rechazada.', 5, tutorId, '');
  } catch (error: any) {
    throw new Error('Error al rechazar al tutor: ' + error.message);
  }
}