import { useAuth } from "../context/AuthContext";
import CalendarioMensual from "../components/CalendarioMensual";
import Navbar from "../components/Navbar";
import ClasesDisponiblesSemana from "../components/ClasesDisponiblesSemana";
import ToastMensaje from "../components/ToastMensaje"; 
import { useState } from "react";
import PoleKittyInfo from "../components/PoleKittyInfo";

const CalendarPage = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState<{ mensaje: string; tipo?: "exito" | "error" | "info" } | null>(null);
  const cerrarToast = () => setToast(null);

  if (!user) return <p className="text-white">Cargando usuario...</p>;

    const capitalizarNombre = (nombre: string | null | undefined) => {
    if (!nombre) return "";
    return nombre
      .split(" ")
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white space-y-6">
        <p className="text-violet-400 text-lg font-semibold text-center">
          ¡Hola {capitalizarNombre(user?.displayName)}! Elegí tu clase favorita y reservá tu lugar con magia Polekitty.
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
       <ClasesDisponiblesSemana />
       
        <div className="sm:w-[48%] w-full bg-gray-850 border-l-4 border-violet-700 p-4 rounded-xl shadow-md text-fuchsia-300">
          <h4 className="font-semibold text-violet-400 mb-2">✨ Tips para tu próxima clase:</h4>
          <ul className="space-y-2 text-sm">
            <li className="bg-gray-800 p-2 rounded-lg border-l-2 border-violet-600">
              <span className="text-violet-300 font-semibold">Traer Short y top</span>
            </li>
            <li className="bg-gray-800 p-2 rounded-lg border-l-2 border-violet-600">
              <span className="text-violet-300 font-semibold">No usar cremas corporales</span>
            </li>
            <li className="bg-gray-800 p-2 rounded-lg border-l-2 border-violet-600">
              <span className="text-violet-300 font-semibold">No usar anillos</span>
            </li>
            <li className="bg-gray-800 p-2 rounded-lg border-l-2 border-violet-600">
              <span className="text-violet-300 font-semibold">Botella de agua</span>
            </li>
          </ul>
        </div>
        </div>
          <div className="flex flex-col sm:flex-row sm:gap-6">
  <CalendarioMensual setToast={setToast} />
  <PoleKittyInfo />
</div>
      </div>
      {toast && <ToastMensaje mensaje={toast.mensaje} tipo={toast.tipo} onClose={cerrarToast} />}
    </>
  );
};

export default CalendarPage;