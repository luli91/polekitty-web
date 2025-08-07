import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { Link } from "react-router-dom";
import { UserIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface Usuario {
  id: string;
  uid: string;
  nombre: string;
  apellido?: string;
  email: string;
  role: string;
  puedeAnotarse?: boolean;
}

const PAGE_SIZE = 10;

const Alumnas = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    let q = query(collection(db, "users"), orderBy("nombre"), limit(PAGE_SIZE));
    if (lastDoc) {
      q = query(collection(db, "users"), orderBy("nombre"), startAfter(lastDoc), limit(PAGE_SIZE));
    }

    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Usuario[];

    const soloAlumnas = lista.filter(u => u.role !== "admin");

    setUsuarios(prev => {
      const combinados = [...prev, ...soloAlumnas];
      const únicos = Array.from(new Map(combinados.map(u => [u.uid, u])).values());
      return únicos;
    });

    if (snapshot.docs.length < PAGE_SIZE) {
      setNoMore(true);
    }

    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellido ?? ""}`.toLowerCase().includes(filter.toLowerCase())
  );

  const total = usuarios.length;
  const habilitadas = usuarios.filter(u => u.puedeAnotarse).length;
  const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <UserIcon className="w-6 h-6 text-pink-500" />
        Lista de Alumnas
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Alumnas habilitadas: <strong>{habilitadas}</strong> / Total: <strong>{total}</strong>
      </p>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {usuariosFiltrados.length === 0 ? (
        <p>No se encontraron alumnas.</p>
      ) : (
        usuariosFiltrados.map(usuario => (
          <div key={usuario.id} className="flex justify-between items-center mb-2 bg-white/80 p-3 rounded shadow">
            <div>
              <p className="font-semibold text-lg text-pink-700">
                {capitalize(usuario.nombre)} {capitalize(usuario.apellido ?? "")}
              </p>
              <p className="text-sm text-gray-600">{usuario.email}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                Estado:{" "}
                {usuario.puedeAnotarse ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircleIcon className="w-4 h-4" /> Habilitada
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircleIcon className="w-4 h-4" /> No habilitada
                  </span>
                )}
              </p>
            </div>
            <Link
              to={`/dashboard/clienta/${usuario.uid}`}
              className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition"
              title="Ver perfil y habilitar"
            >
              Ver perfil
            </Link>
          </div>
        ))
      )}

      {!noMore && (
        <button
          onClick={fetchUsuarios}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Cargar más"}
        </button>
      )}
    </div>
  );
};

export default Alumnas;
