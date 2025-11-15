import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  type User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOnrLGUHUcnlmUnPukjFEZ5woTMbiZAU8",
  authDomain: "robo-ai----learner.firebaseapp.com",
  projectId: "robo-ai----learner",
  storageBucket: "robo-ai----learner.firebasestorage.app",
  messagingSenderId: "226428976744",
  appId: "1:226428976744:web:5c15e2ae38c03d15e105dd",
  measurementId: "G-3T5XWJSTY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    createUserWithEmailAndPassword,
    doc,
    setDoc,
    collection,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    deleteDoc
};
export type { User };