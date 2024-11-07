// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1faOp7qIITJOd_nX-h4caWUVFh0VSY1g",
  authDomain: "yoututor-b0b52.firebaseapp.com",
  projectId: "yoututor-b0b52",
  storageBucket: "yoututor-b0b52.appspot.com",
  messagingSenderId: "592465045185",
  appId: "1:592465045185:web:3b62be68acb9808bd45640",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Auth
const db = getFirestore(app);
export { db };
