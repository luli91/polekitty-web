import {
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const cancelarClaseYNotificar = async (claseId: string, uidActual: string) => {
  try {
    // 1. Eliminar la reserva
    await deleteDoc(doc(db, `clases/${claseId}/reservas`, uidActual));

    // 2. Obtener datos de la clase
    const claseSnap = await getDoc(doc(db, "clases", claseId));
    const claseData = claseSnap.data();
    if (!claseData) return;

    const { nivel, horario, fecha } = claseData;
    const fechaStr = fecha.toDate().toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const mensaje = `Se liberó un lugar en ${nivel} – ${fechaStr} a las ${horario} 💫`;

    // 3. Obtener alumnas habilitadas
    const usuariosSnap = await getDocs(
      query(
        collection(db, "users"),
        where("notificacionesActivas", "==", true),
        where("puedeAnotarse", "==", true)
      )
    );

    // 4. Obtener uids ya anotadas desde subcolección
    const reservasSnap = await getDocs(collection(db, `clases/${claseId}/reservas`));
    const uidsAnotadas = reservasSnap.docs.map(doc => doc.id);

    const destinatarias = usuariosSnap.docs
      .filter(doc => {
        const data = doc.data();
        return !uidsAnotadas.includes(data.uid);
      })
      .map(doc => doc.id);

    if (destinatarias.length === 0) return;

    // 5. Crear notificación
    await addDoc(collection(db, "notificaciones"), {
      mensaje,
      destinatarias,
      fechaCreacion: Timestamp.now(),
      tipo: "nuevaClase",
    });

    console.log("✨ Notificación creada con magia Polekitty");
  } catch (error) {
    console.error("Error al cancelar y notificar:", error);
  }
};
