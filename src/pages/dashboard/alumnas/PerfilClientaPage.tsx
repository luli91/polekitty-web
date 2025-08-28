import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

type Clienta = {
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  telefono: string;
  direccion?: {
    calle?: string;
    numero?: string;
    ciudad?: string;
  };
  telefonoEmergencia1?: {
    nombre?: string;
    telefono?: string;
  };
  clasesReservadas: string[];
  puedeAnotarse: boolean;
};

type Clase = {
  id: string;
  fecha: string;
  hora: string;
  descripcion: string;
};

const PerfilClientaPage = () => {
  const { uid } = useParams();
  const [clienta, setClienta] = useState<Clienta | null>(null);
  const [clases, setClases] = useState<Clase[]>([]);
  const [mensaje] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!uid) return;
      const ref = doc(db, "users", uid);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        const data = snapshot.data() as Clienta;
        setClienta(data);

        // Fetch clases reservadas
        if (data.clasesReservadas?.length > 0) {
          const clasesRef = collection(db, "clases");
          const todas = await getDocs(clasesRef);
          const clasesFiltradas = todas.docs
            .filter(doc => data.clasesReservadas.includes(doc.id))
            .map(doc => {
              const data = doc.data();
                return {
                  id: doc.id,
                  fecha: data.fecha?.toDate().toISOString(), 
                  hora: data.horario,
                  descripcion: data.descripcion,
                 };
              });
          setClases(clasesFiltradas);
        }
      }
    };

    fetchUsuario();
  }, [uid]);

const formatearFecha = (fecha: string | Date) => {
  try {
    const date = typeof fecha === "string" ? new Date(fecha) : fecha;
    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Fecha no disponible";
  }
};

  const toggleHabilitacion = async () => {
    if (!uid || !clienta) return;
    const nuevoEstado = !clienta.puedeAnotarse;
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { puedeAnotarse: nuevoEstado });

    setClienta((prev) => prev && { ...prev, puedeAnotarse: nuevoEstado });
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  if (!clienta) return <div className="text-white">Cargando datos...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6 text-black">
      {/* Botón de habilitación */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-pink-600">
            Perfil de {capitalize(clienta.nombre)} {capitalize(clienta.apellido)}
          </h2>
          <div className="flex items-center gap-3">
  <span className="text-sm font-medium text-gray-700">
    {clienta.puedeAnotarse ? "Habilitada para clases" : "No habilitada"}
  </span>
  <button
    onClick={toggleHabilitacion}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
      clienta.puedeAnotarse ? "bg-green-500" : "bg-red-500"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        clienta.puedeAnotarse ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
</div>

        </div>

        {mensaje && (
          <div className="mt-4 p-3 bg-fuchsia-100 border-l-4 border-fuchsia-500 text-sm text-gray-800 rounded">
            {mensaje}
          </div>
        )}
      </div>

      {/* Datos personales */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-pink-600 mb-4">Datos personales</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Edad:</strong> {clienta.edad}</li>
          <li><strong>Dirección:</strong> {clienta.direccion?.calle} {clienta.direccion?.numero}, {clienta.direccion?.ciudad}</li>
        </ul>
      </div>

      {/* Contacto */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-pink-600 mb-4">Contacto</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Email:</strong> {clienta.email}</li>
          <li><strong>Teléfono personal:</strong> {clienta.telefono}</li>
          <li><strong>Contacto de emergencia:</strong> {clienta.telefonoEmergencia1?.nombre} ({clienta.telefonoEmergencia1?.telefono})</li>
        </ul>
      </div>

      {/* Clases reservadas */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-pink-600 mb-4">Clases reservadas</h3>
        {clases.length > 0 ? (
          <ul className="space-y-3 text-sm text-gray-700">
            {clases.map((clase) => (
              <li key={clase.id} className="border-b pb-2">
                <p className="text-lg font-semibold text-pink-600">
                  📅 {formatearFecha(clase.fecha)}
                </p>
                <p><strong>Hora:</strong> {clase.hora}</p>
                <p><strong>Descripción:</strong> {clase.descripcion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No tiene clases reservadas aún.</p>
        )}
      </div>

      {/* Volver */}
      <Link
        to="/dashboard/alumnas"
        className="block w-full text-center bg-fuchsia-600 text-white py-2 px-4 rounded hover:bg-fuchsia-700 transition text-sm font-semibold"
      >
        ← Volver al listado
      </Link>
    </div>
  );
};

export default PerfilClientaPage;
