import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generarClasesMes } from "../utils/generarClasesMes";
import dayjs from "dayjs";

const BotonGenerarClases = () => {
  const { user } = useAuth();
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const hoy = dayjs();
  const mesActual = hoy.month() + 1; // dayjs es 0-indexed
  const añoActual = hoy.year();

  const handleGenerar = async () => {
    if (user?.role !== "admin") {
      setMensaje("⚠️ Solo el equipo Polekitty puede generar clases.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const resultadoMesActual = await generarClasesMes(mesActual, añoActual);
      const resultadoMesSiguiente = await generarClasesMes(mesActual + 1, añoActual);

      setMensaje(
        `✨ ${resultadoMesActual.nuevas} nuevas clases en ${mesActual}/${añoActual}\n` +
        `🌀 ${resultadoMesActual.existentes} ya existían\n\n` +
        `✨ ${resultadoMesSiguiente.nuevas} nuevas en ${mesActual + 1}/${añoActual}\n` +
        `🌀 ${resultadoMesSiguiente.existentes} ya existían`
      );
    } catch (error) {
      console.error("Error al generar clases:", error);
      setMensaje("⚠️ Ocurrió un error al generar las clases.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 text-center">
      <button
        onClick={handleGenerar}
        disabled={loading}
        className="px-4 py-2 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700 disabled:opacity-50"
      >
        ✨ Generar clases del mes
      </button>
      {mensaje && (
        <p className="mt-3 whitespace-pre-line text-sm text-fuchsia-300 font-mono">{mensaje}</p>
      )}
    </div>
  );
};

export default BotonGenerarClases;
