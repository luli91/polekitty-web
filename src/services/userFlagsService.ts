import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const crearUserFlags = async (
  uid: string,
  notificacionesActivas = true,
  puedeAnotarse = true
) => {
  try {
    await setDoc(doc(db, "userFlags", uid), {
      notificacionesActivas,
      puedeAnotarse
    });
    console.log(`✅ userFlags creados para UID: ${uid}`);
  } catch (error) {
    console.error("❌ Error creando userFlags:", error);
  }
};
