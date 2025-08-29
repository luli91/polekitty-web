import * as admin from "firebase-admin";

export const onPagoAprobado = async (uid: string, clasesPagadas: number) => {
  const userRef = admin.firestore().doc(`users/${uid}`);

  await userRef.update({
    puedeAnotarse: true,
    clasesDisponibles: admin.firestore.FieldValue.increment(clasesPagadas),
    fechaPago: admin.firestore.Timestamp.now(),
  });

  console.log(`🎉 Pago aprobado para ${uid}: ${clasesPagadas} clases asignadas`);
};
