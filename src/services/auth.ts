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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { UserData } from "../types";

const ADMIN_EMAIL = "florencia@polekitty.com";

export const registerWithEmail = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export async function ensureUserProfile(user: User): Promise<UserData> {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const isAdmin = user.email === ADMIN_EMAIL;
console.log("UID recibido:", user.uid);
console.log("Snapshot existe:", snapshot.exists());
console.log("Datos del snapshot:", snapshot.data());

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

    await setDoc(userRef, newUser);
    return newUser;
  } else {
    return snapshot.data() as UserData;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<UserData> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return await ensureUserProfile(result.user);
}

export async function loginWithGoogle(): Promise<UserData> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return await ensureUserProfile(result.user);
}

export const handleGoogleRedirectResult = async (): Promise<UserData | null> => {
  const result = await getRedirectResult(auth);
  const user = result?.user;
  if (!user) return null;
  return await ensureUserProfile(user);
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
          // Pedirle al usuario que ingrese su contraseña
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
