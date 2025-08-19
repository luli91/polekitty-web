import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface Clase {
  id: string;
  fecha: string;
  horario: string;
  nivel: string;
  cupoMaximo: number;
  anotadas: string[];
}

interface ModalReservaClaseProps {
  fecha: string;
  clases: Clase[];
  user: any;
  onClose: () => void;
  setToast: (toast: { mensaje: string; tipo?: "exito" | "error" | "info" }) => void;
}

const ModalReservaClase = ({ fecha, clases, user, onClose, setToast }: ModalReservaClaseProps) => {
  const [clasesActualizadas, setClasesActualizadas] = useState<Clase[]>([]);

  useEffect(() => {
    const unsubscribes = clases.map(clase => {
      const claseRef = doc(db, "clases", clase.id);
      return onSnapshot(claseRef, snapshot => {
        const data = snapshot.data();
        if (data) {
          setClasesActualizadas(prev => {
            const sinEsta = prev.filter(c => c.id !== clase.id);
            return [...sinEsta, { id: clase.id, ...data } as Clase];
          });
        }
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [clases]);

  const handleReserva = async (claseId: string) => {
    await updateDoc(doc(db, "clases", claseId), {
      anotadas: arrayUnion(user.uid),
    });
    setToast({ mensaje: "¡Clase reservada! 💖", tipo: "exito" });
    onClose();
  };

  const handleCancelacion = async (claseId: string) => {
    await updateDoc(doc(db, "clases", claseId), {
      anotadas: arrayRemove(user.uid),
    });
    setToast({ mensaje: "Tu lugar fue liberado. ¡Te esperamos cuando estés lista! 🌙", tipo: "info" });
    onClose();
  };

  const fechaFormateada = dayjs(fecha).format("DD-MM-YYYY");

  const clasesOrdenadas = clasesActualizadas
    .slice()
    .sort((a, b) => {
      const horaA = dayjs(`${fecha} ${a.horario}`, "YYYY-MM-DD HH:mm");
      const horaB = dayjs(`${fecha} ${b.horario}`, "YYYY-MM-DD HH:mm");
      return horaA.diff(horaB);
    });

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg text-white flex flex-col max-h-[90vh]">
        <h3 className="text-xl font-bold text-fuchsia-400 mb-4 text-center">
          Reservar clase {fechaFormateada}
        </h3>

        <div className="flex-1 overflow-y-auto pr-1">
          {clasesOrdenadas.length === 0 ? (
            <p className="text-center text-gray-400 italic">No hay clases disponibles para este día.</p>
          ) : (
            <ul className="space-y-3">
              {clasesOrdenadas.map(clase => {
                const yaAnotada = clase.anotadas?.includes(user.uid);
                const cupoRestante = clase.cupoMaximo - clase.anotadas.length;
                const claseLlena = cupoRestante <= 0;

                return (
                  <li
                    key={clase.id}
                    className={`bg-gray-850 border rounded p-4 shadow-md ${
                      yaAnotada ? "border-green-400" : "border-fuchsia-700"
                    }`}
                  >
                    <p className="font-semibold text-fuchsia-300">
                      {clase.horario} – {clase.nivel}
                    </p>

                    {yaAnotada ? (
                      <>
                        <p className="mt-2 text-green-400 font-semibold">💖 Ya estás anotada a esta clase</p>
                        <button
                          onClick={() => handleCancelacion(clase.id)}
                          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          ❌ Cancelar asistencia
                        </button>
                      </>
                    ) : claseLlena ? (
                      <p className="mt-2 text-sm text-gray-400 italic">Cupo completo</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-300">Cupo restante: {cupoRestante}</p>
                        <button
                          onClick={() => handleReserva(clase.id)}
                          className="mt-2 px-3 py-1 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700 text-sm"
                        >
                          💖 Confirmar asistencia
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-fuchsia-400 transition block mx-auto"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalReservaClase;
