import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

type Clienta = {
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  telefono: string;
  role: string;
  puedeAnotarse: boolean;
  clasesReservadas: string[]; 
};

    const PerfilClientaPage = () => {
  const { uid } = useParams();
  const [clienta, setClienta] = useState<Clienta | null>(null);
  
        // Carga de datos desde Firestore
  useEffect(() => {
    const fetchUsuario = async () => {
      if (!uid) return;
      const ref = doc(db, "users", uid);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setClienta(snapshot.data() as Clienta);
      } else {
        console.warn("No se encontró el usuario");
      }
    };

    fetchUsuario();
  }, [uid]);

  const toggleHabilitacion = async () => {
    if (!uid || !clienta) return;
    const nuevoEstado = !clienta.puedeAnotarse;
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { puedeAnotarse: nuevoEstado });
    alert(
      nuevoEstado
        ? "Clienta habilitada para anotarse a clases."
        : "Clienta deshabilitada para anotarse."
    );
    setClienta((prev) => prev && { ...prev, puedeAnotarse: nuevoEstado });
  };

  if (!clienta) return <div className="text-white">Cargando datos...</div>;

    const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white/10 rounded-lg shadow-lg text-black">
      <h2 className="text-2xl font-bold mb-4">👤 Perfil de {capitalize(clienta.nombre)}</h2>
      <ul className="space-y-2 mb-6">
        <li><strong>Apellido:</strong> {clienta.apellido}</li>
        <li><strong>Edad:</strong> {clienta.edad}</li>
        <li><strong>Email:</strong> {clienta.email}</li>
        <li><strong>Teléfono:</strong> {clienta.telefono}</li>
        <li><strong>Rol:</strong> {clienta.role}</li>
        <li><strong>Puede anotarse:</strong> {clienta.puedeAnotarse ? "Sí" : "No"}</li>
      </ul>

      <button
        onClick={toggleHabilitacion}
        className={`w-full py-2 px-4 rounded transition ${
          clienta.puedeAnotarse
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        {clienta.puedeAnotarse
          ? "❌ Deshabilitar para clases"
          : "✅ Habilitar para clases"}
      </button>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">📅 Clases reservadas</h3>
        {clienta.clasesReservadas?.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {clienta.clasesReservadas.map((clase, index) => (
              <li key={index}>{clase}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No tiene clases reservadas aún.</p>
        )}
      </div>
    </div>
  );
};


export default PerfilClientaPage;
