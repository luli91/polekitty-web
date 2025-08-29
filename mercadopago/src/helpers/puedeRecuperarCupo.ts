import * as admin from "firebase-admin";

export const puedeRecuperarCupo = (fechaClase: admin.firestore.Timestamp): boolean => {
  const ahora = admin.firestore.Timestamp.now();
  const diferencia = fechaClase.toDate().getTime() - ahora.toDate().getTime();
  return diferencia > 24 * 60 * 60 * 1000;
};
