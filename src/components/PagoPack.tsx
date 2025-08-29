import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const packs = [
  { nombre: "Pack de 4 clases", clases: 4, precio: 30000 },
  { nombre: "Pack de 8 clases", clases: 8, precio: 35000 },
  { nombre: "Pack de 12 clases", clases: 12, precio: 42000 },
  { nombre: "Pack libre (20 clases)", clases: 20, precio: 60000 },
  { nombre: "Clase particular (1:30hs)", clases: 1, precio: 15000 },
];

const PagoPack = () => {
  const { user } = useAuth();
  const [packSeleccionado, setPackSeleccionado] = useState(packs[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generarPreferencia = async () => {
    if (!user?.uid) {
      setError("⚠️ No se pudo cargar tu perfil.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://us-central1-polekitty.cloudfunctions.net/crearPreferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          nombrePack: packSeleccionado.nombre,
          precio: packSeleccionado.precio,
          clases: packSeleccionado.clases,
        }),
      });

      const data = await response.json();

      if (data.init_point) {
       window.open(data.init_point, "_blank");
      } else {
        setError("❌ No se pudo generar el link de pago.");
      }
    } catch (err) {
      console.error("Error al generar preferencia:", err);
      setError("❌ Error inesperado. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-xl font-bold text-fuchsia-400 mb-4 text-center">💸 Elegí tu pack Polekitty</h2>

      <select
        value={packSeleccionado.nombre}
        onChange={(e) => {
          const nombre = e.target.value;
          const nuevoPack = packs.find(p => p.nombre === nombre);
          if (nuevoPack) setPackSeleccionado(nuevoPack);
        }}
        className="w-full bg-gray-800 text-fuchsia-300 p-2 rounded mb-4"
      >
        {packs.map((pack) => (
          <option key={pack.nombre} value={pack.nombre}>
            {pack.nombre} – ${pack.precio}
          </option>
        ))}
      </select>

      <button
        onClick={generarPreferencia}
        disabled={loading}
        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 rounded transition"
      >
        {loading ? "Generando link mágico..." : "Ir a pagar"}
      </button>

      {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
    </div>
  );
};

export default PagoPack;
