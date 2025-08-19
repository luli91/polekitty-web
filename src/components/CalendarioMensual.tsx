import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { GiPartyPopper } from "react-icons/gi";
import ModalReservaClase from "./ModalReservaClase";
import { useAuth } from "../context/AuthContext";

const diasPermitidos = ["Wednesday", "Friday", "Saturday"];
const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const CalendarioMensual = ({
  setToast,
}: {
  setToast: (toast: { mensaje: string; tipo?: "exito" | "error" | "info" }) => void;
}) => {
  const { user } = useAuth();
  const [clases, setClases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [mesSeleccionado, setMesSeleccionado] = useState<number>(new Date().getMonth());

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mesActual = hoy.getMonth();

  useEffect(() => {
    const fetchClases = async () => {
      const snapshot = await getDocs(collection(db, "clases"));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClases(lista);
      setLoading(false);
    };
    fetchClases();
  }, []);

  const nombreMes = (mes: number) => {
    const nombre = new Date(año, mes, 1).toLocaleDateString("es-AR", { month: "long" });
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  };

  const generarDiasMes = (mes: number) => {
    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const primerDiaSemana = new Date(año, mes, 1).getDay();
    const dias: (Date | null)[] = Array(primerDiaSemana).fill(null);
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(new Date(año, mes, i));
    }
    return dias;
  };

  const formatearFecha = (fecha: Date) => fecha.toISOString().split("T")[0];

  const mesesParaMostrar = [mesSeleccionado, mesSeleccionado + 1];

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      {loading && (
        <div className="text-center text-fuchsia-400 animate-pulse mt-4">
          ✨ Cargando clases mágicas...
        </div>
      )}

      {!loading && (
        <>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(Number(e.target.value))}
            className="bg-gray-900 text-fuchsia-300 rounded-md p-2 mb-4"
          >
            {[...Array(6)].map((_, i) => {
              const mes = mesActual + i;
              return (
                <option key={mes} value={mes}>
                  {nombreMes(mes)}
                </option>
              );
            })}
          </select>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:gap-4">
              {mesesParaMostrar.map((mesIterado) => {
                const dias = generarDiasMes(mesIterado);
                return (
                  <div
                    key={mesIterado}
                    className="bg-gray-950 border border-fuchsia-700 rounded-xl shadow-lg p-4 sm:p-6 w-full sm:w-[48%] transition-all"
                  >
                    <h3 className="text-fuchsia-400 text-xl font-bold text-center mb-4">
                      {nombreMes(mesIterado)}
                    </h3>

                    <div className="grid grid-cols-7 gap-1 text-center text-fuchsia-300 font-semibold mb-2 text-xs sm:text-sm">
                      {diasSemana.map((dia) => (
                        <div key={dia}>{dia}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {dias.map((fecha, index) => {
                        if (!fecha) return <div key={index} className="h-[60px] sm:h-[80px]" />;

                        const fechaStr = formatearFecha(fecha);
                        const diaSemana = fecha.toLocaleDateString("en-US", { weekday: "long" });

                        const clasesDelDia = clases.filter((c) => {
                          const fechaClase = c.fecha?.toDate?.();
                          if (!fechaClase) return false;
                          return formatearFecha(fechaClase) === fechaStr;
                        });

                        const hayCupo = clasesDelDia.some(
                          (c) => (c.cupoMaximo ?? 0) > (c.anotadas?.length ?? 0)
                        );
                        const esPermitido = diasPermitidos.includes(diaSemana);

                        const color = hayCupo
                          ? "bg-gray-850 border-fuchsia-700"
                          : esPermitido
                          ? "bg-gray-900 border-gray-700"
                          : "bg-gray-950 border-gray-800 opacity-40";

                        return (
                          <div
                            key={fechaStr}
                            className={`border rounded-md p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] text-[11px] sm:text-sm shadow-sm cursor-pointer transition-all
                              ${color}
                              ${hayCupo ? "border-fuchsia-500 hover:shadow-fuchsia-md" : ""}
                            `}
                            onClick={() => esPermitido && hayCupo && setDiaSeleccionado(fechaStr)}
                          >
                            <p className="text-fuchsia-300 font-medium">{fecha.getDate()}</p>

                            {clasesDelDia.length > 0 && (
                              <>
                                <ul className="hidden sm:block mt-1 space-y-[2px] text-[10px] sm:text-xs text-gray-300">
                                  {clasesDelDia.map((clase) => (
                                    <li key={clase.id}>
                                      {clase.horario} – {clase.nivel}
                                      {clase.esEvento && (
                                        <span className="text-violet-400 ml-1 inline-flex items-center gap-1">
                                          <GiPartyPopper className="w-3 h-3" />
                                          Evento
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                                <div className="sm:hidden mt-1">
                                  <div className="w-full h-[2px] bg-fuchsia-500 rounded-full opacity-50" />
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {diaSeleccionado && (
        <ModalReservaClase
          fecha={diaSeleccionado}
          clases={clases.filter((c) => {
            const fechaClase = c.fecha?.toDate?.();
            if (!fechaClase) return false;
            return (
              formatearFecha(fechaClase) === diaSeleccionado &&
              (c.cupoMaximo ?? 0) > (c.anotadas?.length ?? 0)
            );
          })}
          user={user}
          onClose={() => setDiaSeleccionado(null)}
          setToast={setToast}
        />
      )}
    </div>
  );
};

export default CalendarioMensual;
