import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";
import "dayjs/locale/es";
import isBetween from "dayjs/plugin/isBetween";

dayjs.locale("es");
dayjs.extend(isBetween);

interface Clase {
  id: string;
  fecha: Date;
  cuposDisponibles: number;
  nivel: string;
  yaAnotada: boolean;
  horario: string;
}

const ClasesDisponiblesSemana = () => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [modo, setModo] = useState<"semana" | "mes" | "siguiente">("semana");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const uidActual = user.uid;
    const hoy = dayjs();
    const finSemana = hoy.add(7, "day");
    const finDeMes = hoy.endOf("month");
    const inicioMesSiguiente = finDeMes.add(1, "day");
    const finMesSiguiente = inicioMesSiguiente.endOf("month");

    const consulta = query(
      collection(db, "clases"),
      where("fecha", ">=", hoy.toDate()),
      where("fecha", "<=", finMesSiguiente.toDate()),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(consulta, async (snapshot) => {
      const clasesConReservas = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const reservasSnap = await getDocs(
            collection(db, `clases/${doc.id}/reservas`)
          );
          const anotadas = reservasSnap.docs.map((d) => d.data().uid);
          const yaAnotada = anotadas.includes(uidActual);
          const cupoMaximo = data.cupoMaximo ?? 0;
          const cuposDisponibles = cupoMaximo - anotadas.length;

          return {
            id: doc.id,
            fecha: data.fecha.toDate(),
            cuposDisponibles,
            nivel: data.nivel || "Nivel no definido",
            yaAnotada,
            horario: data.horario,
          };
        })
      );

      const semana = clasesConReservas.filter((clase) =>
        dayjs(clase.fecha).isBetween(hoy.startOf("day"), finSemana, null, "[]")
      );

      const disponiblesSemana = semana.filter(
        (clase) => clase.cuposDisponibles > 0 || clase.yaAnotada
      );

      if (disponiblesSemana.length > 0) {
        setClases(disponiblesSemana.slice(0, 4));
        setModo("semana");
        return;
      }

      const mes = clasesConReservas.filter((clase) =>
        dayjs(clase.fecha).isBetween(hoy, finDeMes.add(1, "day"), null, "[)")
      );

      const disponiblesMes = mes.filter(
        (clase) => clase.cuposDisponibles > 0 || clase.yaAnotada
      );

      if (disponiblesMes.length > 0) {
        setClases(disponiblesMes.slice(0, 4));
        setModo("mes");
        return;
      }

      const siguienteMes = clasesConReservas.filter((clase) =>
        dayjs(clase.fecha).isBetween(
          inicioMesSiguiente,
          finMesSiguiente.add(1, "day"),
          null,
          "[)"
        )
      );

      const disponiblesSiguiente = siguienteMes.filter(
        (clase) => clase.cuposDisponibles > 0 || clase.yaAnotada
      );

      setClases(disponiblesSiguiente.slice(0, 4));
      setModo("siguiente");
    });

    return () => unsubscribe();
  }, []);

  if (clases.length === 0) {
    return (
      <div className="sm:w-[48%] w-full bg-gray-900 border-l-4 border-fuchsia-700 p-4 rounded-xl shadow-md text-center text-fuchsia-400 italic">
        No hay clases disponibles por ahora... ¡pero la magia vuelve pronto! ✨
      </div>
    );
  }

  const titulo =
    modo === "semana"
      ? "✨ Clases con cupo en los próximos 7 días:"
      : modo === "mes"
      ? "✨ Clases con cupo este mes:"
      : "✨ Clases del mes siguiente:";

  return (
    <div className="sm:w-[48%] w-full bg-gray-900 border-l-4 border-fuchsia-700 p-4 rounded-xl shadow-md text-fuchsia-300">
      <h4 className="font-semibold text-fuchsia-400 mb-2">{titulo}</h4>
      <ul className="space-y-2 text-sm">
        {clases.map((clase) => {
          const fecha = dayjs(clase.fecha);
          const dia = fecha.format("dddd");
          const diaNumero = fecha.format("D");
          const hora = clase.horario;

          return (
            <li
              key={clase.id}
              className="bg-gray-800 p-2 rounded-lg border-l-2 border-fuchsia-600"
            >
              <span className="font-semibold text-fuchsia-300">
                {clase.nivel}
              </span>{" "}
              <span className="text-fuchsia-400">
                | {dia} {diaNumero} – 🕒 {hora}
              </span>{" "}
              {clase.yaAnotada ? (
                <span className="text-green-400 font-semibold">
                  💖 Ya estás anotada
                </span>
              ) : (
                <span className="text-fuchsia-500 font-semibold">
                  (quedan {clase.cuposDisponibles} lugares)
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ClasesDisponiblesSemana;
