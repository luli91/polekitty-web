import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { FaUsers } from "react-icons/fa";

interface Clase {
  id: string;
  fecha: string;
  horario: string;
  nivel: string;
  cupoMaximo: number;
  anotadas: string[];
}

interface Alumna {
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

const ListadoClase = () => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [alumnasPorClase, setAlumnasPorClase] = useState<Record<string, Alumna[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClases = async () => {
      const snapshot = await getDocs(collection(db, "clases"));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Clase[];
      setClases(lista);
      setLoading(false);

      // Buscar alumnas anotadas por clase
      const nuevasAlumnasPorClase: Record<string, Alumna[]> = {};

      for (const clase of lista) {
        const alumnas: Alumna[] = [];

        for (const uid of clase.anotadas) {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            alumnas.push({
              uid,
              nombre: data.nombre,
              apellido: data.apellido,
              email: data.email,
              telefono: data.telefono,
            });
          }
        }

        nuevasAlumnasPorClase[clase.id] = alumnas;
      }

      setAlumnasPorClase(nuevasAlumnasPorClase);
    };

    fetchClases();
  }, []);

  if (loading) return <p className="text-white">Cargando clases...</p>;

  return (
    <div className="p-4 md:p-6 text-black">
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-pink-600">
        <FaUsers className="w-5 h-5" />
        Listado de Alumnas por Clase
      </h2>

      <div className="space-y-6">
        {clases.map(clase => (
          <div key={clase.id} className="bg-white/80 p-4 rounded shadow">
            <p className="font-semibold text-lg text-pink-700">
              {clase.fecha} – {clase.horario} – {clase.nivel}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Cupo: {clase.anotadas.length} / {clase.cupoMaximo}
            </p>

            {alumnasPorClase[clase.id]?.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {alumnasPorClase[clase.id].map(alumna => (
                  <li key={alumna.uid}>
                    <span className="font-semibold">{alumna.nombre} {alumna.apellido}</span> – {alumna.email} – {alumna.telefono}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay alumnas anotadas aún.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListadoClase;
