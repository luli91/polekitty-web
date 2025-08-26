import {
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const cancelarClaseYNotificar = async (claseId: string, uidActual: string) => {
  if (!uidActual) return console.warn("⚠️ UID actual faltante");

  try {
    // 1️⃣ Cancelar reserva
    await deleteDoc(doc(db, `clases/${claseId}/reservas`, uidActual));
    console.log("✅ Reserva eliminada para UID:", uidActual);

    // 2️⃣ Datos de la clase
    const claseSnap = await getDoc(doc(db, "clases", claseId));
    const claseData = claseSnap.data();
    if (!claseData) return console.warn("⚠️ Clase no encontrada");

    const { nivel, horario, fecha } = claseData;
    const fechaStr = fecha.toDate().toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const mensaje = `Se liberó un lugar en ${nivel} – ${fechaStr} a las ${horario} 💫`;

    // 3️⃣ UIDs ya anotadas (no notificarles)
    const reservasSnap = await getDocs(collection(db, `clases/${claseId}/reservas`));
    const uidsAnotadas = reservasSnap.docs.map((d) => d.id);
    console.log("UIDs anotadas actualmente:", uidsAnotadas);

    // 4️⃣ Destinatarias posibles (alumnas habilitadas)
    const flagsSnap = await getDocs(
      query(
        collection(db, "userFlags"),
        where("notificacionesActivas", "==", true),
        where("puedeAnotarse", "==", true)
      )
    );

    const posibles = flagsSnap.docs.map((d) => d.id);
    console.log("Docs encontrados en userFlags:", flagsSnap.docs.map(d => ({id: d.id, ...d.data()})));

    // Filtrar solo UIDs válidas: no anotadas, no el que cancela y existen en userFlags
    const destinatarias = posibles.filter(
      (uid) => !uidsAnotadas.includes(uid) && uid !== uidActual
    );
    console.log("UIDs destinatarias finales:", destinatarias);

    if (destinatarias.length === 0) {
      console.warn("⚠️ No hay destinatarias habilitadas para esta notificación");
      return;
    }

    // 5️⃣ Crear notificación
    await addDoc(collection(db, "notificaciones"), {
      mensaje,
      destinatarias,
      fechaCreacion: serverTimestamp(),
      tipo: "nuevaClase",
      creadoPor: uidActual,
    });

    console.log("✅ Notificación creada para alumnas");

  } catch (error) {
    console.error("❌ Error al cancelar y notificar:", error);
  }
};
