import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import CampoEditable from "../components/CampoEditable";
import SeccionDestacada from "../components/SeccionDestacada";
import SeccionSecundaria from "../components/SeccionSecundaria";
import PerfilAccordionMobile from "../components/PerfilAccordionMobile";
import MenuDesktop from "../components/MenuDesktop";
import type { UserData, ClaseReservada } from "../types";

const PerfilPage = () => {
  const { user, setUser } = useAuth() as {
    user: UserData;
    setUser: (u: UserData) => void;
  };

  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState("clases");
  const [clasesValidas, setClasesValidas] = useState<ClaseReservada[]>([]);
  const [eventosDisponibles] = useState([
    { nombre: "Clase especial de Flexibilidad", fecha: "25/08/2025" },
    { nombre: "Encuentro Polekitty Primavera", fecha: "15/09/2025" },
  ]);

  const handleGuardarCampo = async (campo: string, nuevoValor: string) => {
    const docRef = doc(db, "users", user.uid);

    if (campo.includes("direccion.")) {
      const subcampo = campo.split(".")[1];
      const nuevaDireccion = {
        ...user.direccion,
        [subcampo]: nuevoValor,
      };
      await updateDoc(docRef, { direccion: nuevaDireccion });
      setUser({ ...user, direccion: nuevaDireccion });
    } else if (campo.includes("telefonoEmergencia1.")) {
      const subcampo = campo.split(".")[1];
      const nuevoContacto = {
        ...user.telefonoEmergencia1,
        [subcampo]: nuevoValor,
      };
      await updateDoc(docRef, { telefonoEmergencia1: nuevoContacto });
      setUser({ ...user, telefonoEmergencia1: nuevoContacto });
    } else {
      await updateDoc(docRef, { [campo]: nuevoValor });
      setUser({ ...user, [campo]: nuevoValor });
    }
  };

  useEffect(() => {
    const fetchClasesReservadas = async () => {
      if (!user?.clasesReservadas || user.clasesReservadas.length === 0) return;

      const clases: ClaseReservada[] = [];

      for (const claseId of user.clasesReservadas) {
        const claseRef = doc(db, "clases", claseId);
        const claseSnap = await getDoc(claseRef);
        const data = claseSnap.data();

        if (data?.fecha && data?.horario && data?.nivel) {
          const fechaStr = data.fecha.toDate().toLocaleDateString("es-AR");
          clases.push({
            fecha: fechaStr,
            hora: data.horario,
            nivel: data.nivel,
          });
        }
      }

      setClasesValidas(clases);
    };

    fetchClasesReservadas();
  }, [user]);

    if (!user) return <div className="text-white">Cargando perfil...</div>;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white font-sans p-3 flex flex-col items-center">
        {/* Sección destacada */}
        <div className="w-full max-w-6xl mb-6">
          <SeccionDestacada
            titulo={`Bienvenida, ${user.nombre}!`}
            subtitulo="Este es tu espacio personal. Acá podés ver tus datos, tus clases y conectarte con la comunidad Polekitty."
          />
        </div>

        {/* Layout principal */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-4 w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        {/* Mobile: acordeón */}
        <div className="lg:hidden w-full">
          <PerfilAccordionMobile
            user={user}
            clasesValidas={clasesValidas}
            handleGuardarCampo={handleGuardarCampo}
          />
        </div>

        {/* Desktop: menú lateral + panel dinámico */}
          <MenuDesktop
            seccionActiva={seccionActiva}
            setSeccionActiva={setSeccionActiva}
          />

        <div className="hidden lg:flex lg:w-3/4 flex-col gap-6">
          {seccionActiva === "clases" && (
            <SeccionSecundaria titulo="Clases reservadas">
              {clasesValidas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clasesValidas.map((clase, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-violet-800 to-gray-900 rounded-xl p-4 shadow-lg border-l-4 border-violet-500 hover:scale-[1.02] hover:shadow-xl transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-fuchsia-400 text-xl">📅</span>
                        <p className="text-lg font-semibold text-white">{clase.fecha}</p>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {clase.hora} — {clase.nivel}
                      </p>
                      <button
                        onClick={() => navigate("/calendario")}
                        className="px-3 py-1 bg-violet-600 text-white rounded-full hover:bg-fuchsia-700 transition text-sm w-fit"
                      >
                      Ver detalles
                      </button>
                    </div>  
                  ))
                  }
              </div>
              ) : (
                <div className="space-y-2">
                  <p>No tenés clases anotadas todavía.</p>
                  <button
                    onClick={() => navigate("/calendario")}
                    className="px-4 py-2 bg-fuchsia-600 text-white rounded-full hover:bg-fuchsia-700 transition"
                  >
                    Ver próximas clases
                  </button>
                </div>
              )}
            </SeccionSecundaria>
          )}

            {seccionActiva === "datos personales" && (
              <SeccionSecundaria titulo="Datos personales">
                <div className="flex flex-col space-y-4 w-full list-none">
                  {/* Fila 1: Nombre, Apellido, Edad */}
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                   <div className="flex-[2] list-none">
                      <CampoEditable label="Nombre" campo="nombre" valor={user.nombre} onGuardar={handleGuardarCampo} />
                    </div>
                    <div className="flex-[2] list-none">
                      <CampoEditable label="Apellido" campo="apellido" valor={user.apellido} onGuardar={handleGuardarCampo} />
                    </div>
                    <div className="flex-[1] list-none">
                      <CampoEditable label="Edad" campo="edad" valor={String(user.edad)} onGuardar={handleGuardarCampo} />
                    </div>
                  </div>

                  {/* Fila 2: Calle, Número */}
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1 list-none">
                      <CampoEditable label="Calle" campo="direccion.calle" valor={user.direccion?.calle || ""} onGuardar={handleGuardarCampo} />
                    </div>
                    <div className="flex-1 list-none">
                      <CampoEditable label="Número" campo="direccion.numero" valor={user.direccion?.numero || ""} onGuardar={handleGuardarCampo} />
                    </div>
                  </div>

                  {/* Fila 3: Ciudad */}
                  <div className="w-full list-none">
                    <CampoEditable label="Ciudad" campo="direccion.ciudad" valor={user.direccion?.ciudad || ""} onGuardar={handleGuardarCampo} />
                  </div>
                </div>
              </SeccionSecundaria>
            )}

            {seccionActiva === "contacto" && (
              <SeccionSecundaria titulo="Contacto">
                <ul className="space-y-4">
                  <CampoEditable label="Email" campo="email" valor={user.email} onGuardar={handleGuardarCampo} />
                  <CampoEditable label="Teléfono personal" campo="telefono" valor={user.telefono} onGuardar={handleGuardarCampo} />
                </ul>
                <h2 className="mt-6">Contacto de emergencia</h2>
                <ul className="space-y-4 mt-2">
                  <CampoEditable label="Nombre contacto de emergencia" campo="telefonoEmergencia1.nombre" valor={user.telefonoEmergencia1?.nombre || ""} onGuardar={handleGuardarCampo} />
                  <CampoEditable label="Teléfono de emergencia" campo="telefonoEmergencia1.telefono" valor={user.telefonoEmergencia1?.telefono || ""} onGuardar={handleGuardarCampo} />                
              </ul>
              </SeccionSecundaria>
            )}

            {seccionActiva === "eventos" && (
              <SeccionSecundaria titulo="Eventos disponibles">
                <ul className="space-y-4">
                  {eventosDisponibles.map((evento, index) => (
                    <li
                      key={index}
                      className="bg-gradient-to-br from-violet-800 to-gray-900 rounded-xl p-4 shadow-lg border-l-4 border-violet-500 hover:scale-[1.02] hover:shadow-xl transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-violet-300 text-xl">🎉</span>
                        <p className="text-white font-semibold text-lg">{evento.nombre}</p>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">📅 Fecha: {evento.fecha}</p>
                      <button className="px-4 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition text-sm w-fit">
                        Quiero participar
                      </button>
                    </li>
                  ))}
                </ul>
              </SeccionSecundaria>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilPage;
