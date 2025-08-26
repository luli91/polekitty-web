import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";

type Notificacion = {
  id: string;
  mensaje: string;
  destinatarias: string[];
  fechaCreacion: any;
  tipo: string;
};

export const useNotificaciones = (uid: string) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [leidas, setLeidas] = useState<string[]>([]);

  useEffect(() => {
    if (!uid) return;

    // 1️⃣ Escuchar notificaciones
    const q = query(
      collection(db, "notificaciones"),
      where("destinatarias", "array-contains", uid),
      orderBy("fechaCreacion", "desc")
    );
    const unsubNoti = onSnapshot(q, (snapshot) => {
      const todas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notificacion[];
      setNotificaciones(todas.slice(0, 10));
    });

    // 2️⃣ Escuchar notificaciones leídas
    const leidasRef = collection(db, `users/${uid}/notificacionesLeidas`);
    const unsubLeidas = onSnapshot(leidasRef, (snapshot) => {
      const idsLeidas = snapshot.docs.map((doc) => doc.id);
      setLeidas(idsLeidas);
    });

    return () => {
      unsubNoti();
      unsubLeidas();
    };
  }, [uid]);

  const noLeidas = notificaciones.filter((n) => !leidas.includes(n.id));

  return { notificaciones, noLeidas, leidas };
};
