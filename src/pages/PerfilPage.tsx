import { useAuth } from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import CampoEditable from "../components/CampoEditable";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Tipos
interface ClaseReservada {
  fecha: string;
  hora: string;
  nivel: string;
}


export interface UserData {
  uid: string;
  nombre: string;
  apellido: string;
  edad: number | null;
  email: string;
  telefono: string;
  direccion?: {
    calle: string;
    numero: string;
    ciudad: string;
  };
  clasesReservadas: {
    fecha: string;
    hora: string;
    nivel: string;
  }[];
  notificacionesActivas: boolean;
  role: string;
  displayName?: string; 
}

const PerfilPage = () => {
  const { user, setUser } = useAuth() as {
  user: UserData;
  setUser: (u: UserData) => void;
};

  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/");
  };

  const handleGuardarCampo = async (campo: string, nuevoValor: string) => {
  const docRef = doc(db, "users", user.uid);

  if (campo.includes("direccion.")) {
    const subcampo = campo.split(".")[1];
    const nuevaDireccion = {
  calle: user.direccion?.calle || "",
  numero: user.direccion?.numero || "",
  ciudad: user.direccion?.ciudad || "",
  [subcampo]: nuevoValor,
};


    await updateDoc(docRef, { direccion: nuevaDireccion });
    setUser({ ...user, direccion: nuevaDireccion });
  } else {
    await updateDoc(docRef, { [campo]: nuevoValor });
    setUser({ ...user, [campo]: nuevoValor });
  }
};


  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const clasesReservadas = Array.isArray(user?.clasesReservadas)
    ? user.clasesReservadas.filter(
        (clase): clase is ClaseReservada =>
          typeof clase === "object" &&
          clase !== null &&
          "fecha" in clase &&
          "hora" in clase &&
          "nivel" in clase
      )
    : [];

  const clasesValidas = clasesReservadas.filter(
    (clase) =>
      clase.fecha?.trim() !== "" &&
      clase.hora?.trim() !== "" &&
      clase.nivel?.trim() !== ""
  );

  const eventosDisponibles = [
    { nombre: "Halloween Pole Jam", fecha: "31/10" },
    { nombre: "Clase especial con luces UV", fecha: "15/09" },
    { nombre: "Show de alumnas", fecha: "01/12" },
  ];

  if (!user) return <div className="text-white">Cargando perfil...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans p-6 flex flex-col items-center">
        {/* Tarjetas emocionales en mobile */}
        <div className="flex flex-row lg:hidden gap-4 mb-6 mt-2 w-full max-w-md justify-center">
          <div className="bg-gray-850 p-4 rounded-xl shadow-md border border-fuchsia-700 text-right w-1/2">
            <h4 className="text-fuchsia-300 font-semibold mb-2 text-sm">💖 Polekitty te acompaña</h4>
            <p className="text-xs">Tu cuerpo, tu ritmo, tu poder.<br />Cada clase es un paso más hacia tu libertad.</p>
          </div>
          <div className="bg-gray-850 p-4 rounded-xl shadow-md border border-violet-700 text-right w-1/2">
            <h4 className="text-violet-300 font-semibold mb-2 text-sm">🌟 Inspiración</h4>
            <p className="text-xs">“La fuerza no viene de lo que podés hacer, sino de superar lo que pensabas que no podías.”</p>
          </div>
        </div>

        {/* Contenedor principal con paneles */}
        <div className="flex flex-col lg:flex-row gap-x-12 w-full max-w-6xl">
          {/* Panel izquierdo emocional en desktop */}
          <div className="hidden lg:flex flex-col gap-6 w-1/4 pt-24">
            <div className="bg-gray-850 p-4 rounded-xl shadow-md border border-fuchsia-700 text-right">
              <h4 className="text-fuchsia-300 font-semibold mb-2">💖 Polekitty te acompaña</h4>
              <p>Tu cuerpo, tu ritmo, tu poder.<br />Cada clase es un paso más hacia tu libertad.</p>
            </div>
            <div className="bg-gray-850 p-4 rounded-xl shadow-md border border-violet-700 text-right">
              <h4 className="text-violet-300 font-semibold mb-2">🌟 Inspiración</h4>
              <p>“La fuerza no viene de lo que podés hacer, sino de superar lo que pensabas que no podías.”</p>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="w-full lg:w-2/4">
            <h2 className="text-3xl font-bold text-fuchsia-400 mb-2 text-center">
              ¡Hola {capitalize(user.nombre)}!
            </h2>
            <p className="text-gray-400 mb-8 text-center max-w-md mx-auto">
              Este es tu espacio personal. Acá podés ver tus datos, tus clases y conectarte con la comunidad Polekitty.
            </p>

            {/* Tarjeta de perfil */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full border border-fuchsia-600 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <FaUserCircle className="text-4xl text-fuchsia-400" />
                <h3 className="text-xl font-semibold text-fuchsia-300">Tu perfil</h3>
              </div>
              <ul className="space-y-4">
                <CampoEditable label="Nombre" campo="nombre" valor={user.nombre} onGuardar={handleGuardarCampo} />
                <CampoEditable label="Apellido" campo="apellido" valor={user.apellido} onGuardar={handleGuardarCampo} />
                <CampoEditable label="Edad" campo="edad" valor={String(user.edad)} onGuardar={handleGuardarCampo} />
                <CampoEditable label="Email" campo="email" valor={user.email} onGuardar={handleGuardarCampo} />
                <CampoEditable label="Teléfono" campo="telefono" valor={user.telefono} onGuardar={handleGuardarCampo} />
                <CampoEditable label="Calle" campo="direccion.calle" valor={user.direccion?.calle || ""} onGuardar={handleGuardarCampo} />
                <CampoEditable label="Número" campo="direccion.numero" valor={user.direccion?.numero || ""} onGuardar={handleGuardarCampo} />
                <CampoEditable label="Ciudad" campo="direccion.ciudad" valor={user.direccion?.ciudad || ""} onGuardar={handleGuardarCampo} />
              </ul>
            </div>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition mx-auto"
            >
              <FaSignOutAlt className="text-lg" />
              Cerrar sesión
            </button>
          </div>

          {/* Panel derecho funcional en desktop */}
          <div className="flex flex-col gap-6 w-full lg:w-1/4 pt-24">
            {/* Próxima clase */}
            <div className="bg-gray-850 p-4 rounded-xl shadow-md border border-fuchsia-700">
              <h4 className="text-fuchsia-300 font-semibold mb-2">📅 Próxima clase</h4>
              {clasesValidas.length > 0 ? (
                <p>{clasesValidas[0].fecha} - {clasesValidas[0].hora}<br />{clasesValidas[0].nivel}</p>
              ) : (
                <p>No tenés clases reservadas aún.</p>
              )}
            </div>

            {/* Todas las clases */}
            <div className="bg-gray-850 p-4 rounded-xl shadow-md border border-fuchsia-700">
              <h4 className="text-fuchsia-300 font-semibold mb-2">📘 Tus clases reservadas</h4>
              {clasesValidas.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {clasesValidas.map((clase, index) => (
                    <li key={index}>{clase.fecha} - {clase.hora} ({clase.nivel})</li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2">
                <p>No tenés clases anotadas todavía.</p>
                <button className="px-3 py-1 bg-fuchsia-600 text-white rounded-full hover:bg-fuchsia-700 transition w-fit">
                  Reservar una clase
                </button>
              </div>
            )}
          </div>

          {/* Eventos disponibles */}
          <div className="bg-gray-850 p-4 rounded-xl shadow-md border border-violet-700">
            <h4 className="text-violet-300 font-semibold mb-2">🎉 Eventos disponibles</h4>
            <ul className="space-y-4">
              {eventosDisponibles.map((evento, index) => (
                <li key={index} className="flex flex-col">
                  <span className="text-white font-medium">{evento.nombre}</span>
                  <span className="text-gray-400 text-sm mb-2">Fecha: {evento.fecha}</span>
                  <button className="px-3 py-1 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition w-fit">
                    Quiero participar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PerfilPage;
