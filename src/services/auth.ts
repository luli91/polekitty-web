import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { UserData } from "../types";

const ADMIN_EMAIL = "florencia@polekitty.com";

export const registerWithEmail = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async (): Promise<UserData | null> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  console.log("Resultado del login con Google:", result);

  if (!user) {
    console.warn("No se obtuvo usuario tras el login.");
    return null;
  }

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const isAdmin = user.email === ADMIN_EMAIL;

  console.log("Snapshot del usuario:", snapshot.exists() ? snapshot.data() : "No existe en Firestore");

  if (!snapshot.exists()) {
    const newUser: UserData = {
      uid: user.uid,
      displayName: user.displayName ?? "Sin nombre",
      email: user.email ?? "Sin email",
      role: isAdmin ? "admin" : "user",
      notificacionesActivas: true,
      clasesReservadas: [],
      nombre: "",
      apellido: "",
      edad: 0,
      telefono: "",
      direccion: { calle: "", numero: "", ciudad: "" },
    };

    console.log("Creando nuevo usuario en Firestore:", newUser);

    await setDoc(userRef, newUser);
    return newUser;
  } else {
    const existingUser = snapshot.data() as UserData;
    console.log("Usuario existente recuperado de Firestore:", existingUser);
    return existingUser;
  }
};

