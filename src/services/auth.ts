import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { UserData } from "../types";


export const registerWithEmail = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export async function ensureUserProfile(user: User): Promise<UserData | null> {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return snapshot.data() as UserData;
}


export async function loginWithEmail(email: string, password: string): Promise<UserData> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const userData = await ensureUserProfile(result.user);

  if (!userData) throw new Error("Usuario no registrado en Firestore");

  return userData;
}

export async function loginWithGoogle(): Promise<UserData> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const userData = await ensureUserProfile(result.user);

  if (!userData) throw new Error("Usuario no registrado en Firestore");

  return userData;
}


export const handleGoogleRedirectResult = async (): Promise<UserData | null> => {
  const result = await getRedirectResult(auth);
  const user = result?.user;
  if (!user) return null;

  const userData = await ensureUserProfile(user);
  return userData;
};


export const loginWithGooglePopup = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData?.email;
      const pendingCred = GoogleAuthProvider.credentialFromError(error);

      if (email && pendingCred) {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes("password")) {
          const password = prompt("Ya existe una cuenta con este email. Ingresá tu contraseña para vincular Google:");
          if (!password) throw new Error("Contraseña requerida");

          const emailUser = await signInWithEmailAndPassword(auth, email, password);
          await linkWithCredential(emailUser.user, pendingCred);
          return emailUser.user;
        }
      }
    }
    throw error;
  }
};
