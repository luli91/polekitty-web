import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

interface Clase {
  id: string;
  fecha: Date;
  cuposDisponibles: number;
  descripcion: string;
  yaAnotada: boolean;
}

const ClasesDisponiblesSemana = () => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [modoMes, setModoMes] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const uidActual = user.uid;
    const hoy = dayjs();
    const finDeSemana = hoy.endOf("week");
    const finDeMes = hoy.endOf("month");
    const clasesRef = collection(db, "clases");

    const consulta = query(
      clasesRef,
      where("fecha", ">=", hoy.toDate()),
      where("fecha", "<=", finDeMes.toDate()),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(consulta, snapshot => {
      const todas = snapshot.docs.map(doc => {
        const data = doc.data();
        const anotadas = Array.isArray(data.anotadas) ? data.anotadas : [];
        const yaAnotada = anotadas.includes(uidActual);
        const cupoMaximo = data.cupoMaximo ?? 0;
        const cuposDisponibles = cupoMaximo - anotadas.length;

        return {
          id: doc.id,
          fecha: data.fecha.toDate(),
          cuposDisponibles,
          descripcion: data.descripcion || "Clase sin descripción",
          yaAnotada,
        };
      });

      const semana = todas.filter(clase =>
        dayjs(clase.fecha).isBefore(finDeSemana.add(1, "day"))
      );

      const filtradasSemana = semana.filter(clase =>
        clase.cuposDisponibles > 0 || clase.yaAnotada
      );

      if (filtradasSemana.length > 0) {
        setClases(filtradasSemana.slice(0, 4));
        setModoMes(false);
      } else {
        const filtradasMes = todas.filter(clase =>
          clase.cuposDisponibles > 0 || clase.yaAnotada
        );
        setClases(filtradasMes.slice(0, 4));
        setModoMes(true);
      }
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

  return (
    <div className="sm:w-[48%] w-full bg-gray-900 border-l-4 border-fuchsia-700 p-4 rounded-xl shadow-md text-fuchsia-300">
      <h4 className="font-semibold text-fuchsia-400 mb-2">
        {modoMes ? "✨ Clases con cupo este mes:" : "✨ Clases con cupo esta semana:"}
      </h4>
      <ul className="space-y-2 text-sm">
        {clases.map(clase => {
          const fecha = dayjs(clase.fecha);
          const dia = fecha.format("dddd");
          const diaNumero = fecha.format("D");
          const hora = fecha.format("HH:mm");

          return (
            <li key={clase.id} className="bg-gray-800 p-2 rounded-lg border-l-2 border-fuchsia-600">
              <span className="font-semibold text-fuchsia-300">{clase.descripcion}</span>{" "}
              <span className="text-fuchsia-400">| {dia} {diaNumero} – {hora}</span>{" "}
              {clase.yaAnotada ? (
                <span className="text-green-400 font-semibold">💖 Ya estás anotada</span>
              ) : (
                <span className="text-fuchsia-500 font-semibold">(quedan {clase.cuposDisponibles} lugares)</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ClasesDisponiblesSemana;
