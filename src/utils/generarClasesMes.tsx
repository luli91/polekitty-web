import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const diasPermitidos = ["Wednesday", "Friday", "Saturday"];

const horariosPorDia: Record<string, { horario: string; nivel: string }[]> = {
  Wednesday: [
    { horario: "18:40", nivel: "Pole sport" },
    { horario: "19:45", nivel: "Pole exotic" },
  ],
  Friday: [
    { horario: "14:40", nivel: "Pole exotic" },
    { horario: "16:00", nivel: "Pole exotic" },
    { horario: "17:30", nivel: "Pole exotic" },
    { horario: "19:00", nivel: "Pole exotic" },
  ],
  Saturday: [
    { horario: "16:00", nivel: "Pole exotic" },
    { horario: "17:30", nivel: "Pole sport" },
    { horario: "19:00", nivel: "Pole exotic" },
  ],
};

export const generarClasesMes = async (
  mes: number,
  año: number
): Promise<{ nuevas: number; existentes: number }> => {
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  let nuevas = 0;
  let existentes = 0;

  for (let i = 1; i <= diasEnMes; i++) {
    const fecha = new Date(año, mes, i);
    const diaSemana = fecha.toLocaleDateString("en-US", { weekday: "long" });

    if (!diasPermitidos.includes(diaSemana)) continue;

    for (const { horario, nivel } of horariosPorDia[diaSemana]) {
      const timestamp = Timestamp.fromDate(fecha);

      const q = query(
        collection(db, "clases"),
        where("fecha", "==", timestamp),
        where("horario", "==", horario)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        existentes++;
        continue;
      }

      await addDoc(collection(db, "clases"), {
        fecha: timestamp,
        horario,
        nivel,
        cupoMaximo: 6,
        esEvento: false,
      });

      nuevas++;
    }
  }

  console.log(
    `✨ Generación ${mes + 1}/${año}: ${nuevas} nuevas, ${existentes} ya existían`
  );

  return { nuevas, existentes };
};
