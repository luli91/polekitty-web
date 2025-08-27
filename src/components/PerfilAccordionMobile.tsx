import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaUserEdit,
  FaPhoneAlt,
  FaStar,
} from "react-icons/fa";
import SeccionSecundaria from "./SeccionSecundaria";
import CampoEditable from "./CampoEditable";
import type { UserData, ClaseReservada } from "../types";

type Props = {
  user: UserData;
  clasesValidas: ClaseReservada[];
  handleGuardarCampo: (campo: string, nuevoValor: string) => Promise<void>;
};

const PerfilAccordionMobile = ({ user, clasesValidas, handleGuardarCampo }: Props) => {
  const [abierta, setAbierta] = useState<string | null>(null);

  const toggle = (id: string) => {
    setAbierta(abierta === id ? null : id);
  };

  return (
    <div className="lg:hidden w-full space-y-4">
      <h2 className="text-xl font-bold text-fuchsia-400">✨ Tu perfil</h2>

      {/* Clases */}
      <div className="bg-gray-800 rounded-xl shadow-md">
        <button
          onClick={() => toggle("clases")}
          className="w-full flex justify-between items-center px-4 py-3 text-left text-white font-medium"
        >
          <span className="flex items-center gap-2">
            <FaCalendarAlt className="text-fuchsia-400" />
            Clases reservadas
          </span>
          {abierta === "clases" ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {abierta === "clases" && (
          <div className="px-4 pb-4 pt-2 text-sm text-gray-300">
            <SeccionSecundaria titulo="">
              {clasesValidas.length > 0 ? (
                <ul className="space-y-4">
                  {clasesValidas.map((clase, index) => (
                    <li
                      key={index}
                      className="bg-gradient-to-br from-violet-800 to-gray-900 rounded-xl p-4 shadow-lg border-l-4 border-violet-500 hover:scale-[1.02] hover:shadow-xl transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-fuchsia-400 text-xl">📅</span>
                        <p className="text-base font-semibold text-white">{clase.fecha}</p>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {clase.hora} — {clase.nivel}
                      </p>
                      <button
                        className="px-3 py-1 bg-violet-600 text-white rounded-full hover:bg-fuchsia-700 transition text-sm w-fit"
                      >
                        Ver detalles
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tenés clases anotadas todavía.</p>
              )}
            </SeccionSecundaria>
          </div>
        )}
      </div>

      {/* Datos personales */}
      <div className="bg-gray-800 rounded-xl shadow-md">
        <button
          onClick={() => toggle("datos")}
          className="w-full flex justify-between items-center px-4 py-3 text-left text-white font-medium"
        >
          <span className="flex items-center gap-2">
            <FaUserEdit className="text-fuchsia-400" />
            Datos personales
          </span>
          {abierta === "datos" ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {abierta === "datos" && (
          <div className="px-4 pb-4 pt-2 text-sm text-gray-300">
            <SeccionSecundaria titulo="">
                <ul className="space-y-4">
                    <CampoEditable label="Nombre" campo="nombre" valor={user.nombre} onGuardar={handleGuardarCampo} />
                    <CampoEditable label="Apellido" campo="apellido" valor={user.apellido} onGuardar={handleGuardarCampo} />
                    <CampoEditable label="Edad" campo="edad" valor={String(user.edad)} onGuardar={handleGuardarCampo} />
                    <CampoEditable label="Calle" campo="direccion.calle" valor={user.direccion?.calle || ""} onGuardar={handleGuardarCampo} />
                    <CampoEditable label="Número" campo="direccion.numero" valor={user.direccion?.numero || ""} onGuardar={handleGuardarCampo} />
                    <CampoEditable label="Ciudad" campo="direccion.ciudad" valor={user.direccion?.ciudad || ""} onGuardar={handleGuardarCampo} />
                </ul>
            </SeccionSecundaria>
          </div>
        )}
      </div>

      {/* Contacto */}
      <div className="bg-gray-800 rounded-xl shadow-md">
        <button
          onClick={() => toggle("contacto")}
          className="w-full flex justify-between items-center px-4 py-3 text-left text-white font-medium"
        >
          <span className="flex items-center gap-2">
            <FaPhoneAlt className="text-fuchsia-400" />
            Contacto
          </span>
          {abierta === "contacto" ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {abierta === "contacto" && (
          <div className="px-4 pb-4 pt-2 text-sm text-gray-300">
            <SeccionSecundaria titulo="">
                <ul className="space-y-4">
                    <CampoEditable label="Email" campo="email" valor={user.email} onGuardar={handleGuardarCampo} />
                    <CampoEditable label="Teléfono" campo="telefono" valor={user.telefono} onGuardar={handleGuardarCampo} />
                    <h3 className="text-fuchsia-400 font-semibold pt-4">📞 Contacto de emergencia</h3>
                    <CampoEditable label="Nombre contacto" campo="telefonoEmergencia1.nombre" valor={user.telefonoEmergencia1?.nombre || ""} onGuardar={handleGuardarCampo} />
                    <CampoEditable label="Teléfono contacto" campo="telefonoEmergencia1.telefono" valor={user.telefonoEmergencia1?.telefono || ""} onGuardar={handleGuardarCampo} />
                    
                </ul>
            </SeccionSecundaria>
          </div>
        )}
      </div>

      {/* Eventos */}
      <div className="bg-gray-800 rounded-xl shadow-md">
        <button
          onClick={() => toggle("eventos")}
          className="w-full flex justify-between items-center px-4 py-3 text-left text-white font-medium"
        >
          <span className="flex items-center gap-2">
            <FaStar className="text-fuchsia-400" />
            Eventos disponibles
          </span>
          {abierta === "eventos" ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {abierta === "eventos" && (
          <div className="px-4 pb-4 pt-2 text-sm text-gray-300">
            <SeccionSecundaria titulo="">
              <ul className="space-y-4">
                {[
                  { nombre: "Clase especial de Flexibilidad", fecha: "25/08/2025" },
                  { nombre: "Encuentro Polekitty Primavera", fecha: "15/09/2025" },
                ].map((evento, index) => (
                  <li
                    key={index}
                    className="bg-gradient-to-br from-violet-800 to-gray-900 rounded-xl p-4 shadow-lg border-l-4 border-violet-500 hover:scale-[1.02] hover:shadow-xl transition"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-violet-300 text-xl">🎉</span>
                      <p className="text-base font-semibold text-white">{evento.nombre}</p>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">📅 Fecha: {evento.fecha}</p>
                    <button className="px-3 py-1 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition text-sm w-fit">
                      Quiero participar
                    </button>
                  </li>
                ))}
              </ul>
            </SeccionSecundaria>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilAccordionMobile;

