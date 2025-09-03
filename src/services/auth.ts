import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { UserData } from "../types";

export const registerWithEmail = async (email: string, password: string) => {
  const methods = await fetchSignInMethodsForEmail(auth, email);
  if (methods.length > 0) throw new Error("email-ya-registrado");
  return await createUserWithEmailAndPassword(auth, email, password);
};

export async function ensureUserProfile(user: User): Promise<UserData | null> {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? (snapshot.data() as UserData) : null;
}

export async function loginWithEmail(email: string, password: string): Promise<UserData> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const userData = await ensureUserProfile(result.user);
  if (!userData) throw new Error("Usuario no registrado en Firestore");
  return userData;
}

export const loginConGoogle = async (): Promise<UserData | "registro-incompleto"> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const userData = await ensureUserProfile(result.user);
    return userData ?? "registro-incompleto";
  } catch (error: any) {
    throw error;
  }
};

export const handleGoogleRedirectResult = async (): Promise<UserData | null> => {
  const result = await getRedirectResult(auth);
  const user = result?.user;
  return user ? await ensureUserProfile(user) : null;
};
