import { FaCalendarAlt, FaUserEdit, FaPhoneAlt, FaStar } from "react-icons/fa";

type Props = {
  seccionActiva: string;
  setSeccionActiva: (s: string) => void;
};

const opciones = [
  { id: "clases", label: "Clases", icon: <FaCalendarAlt className="mr-2" /> },
  { id: "datos personales", label: "Datos personales", icon: <FaUserEdit className="mr-2" /> },
  { id: "contacto", label: "Contacto", icon: <FaPhoneAlt className="mr-2" /> },
  { id: "eventos", label: "Eventos", icon: <FaStar className="mr-2 text-yellow-400" /> },
];

const MenuDesktop = ({ seccionActiva, setSeccionActiva }: Props) => {
  return (
    <div className="hidden lg:flex lg:w-1/4 flex-col gap-4">
      <h2 className="text-xl font-bold text-fuchsia-400">✨ Tu perfil</h2>
      {opciones.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => setSeccionActiva(id)}
          className={`flex items-center px-4 py-2 rounded-lg transition ${
            seccionActiva === id
              ? "bg-fuchsia-700 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
};

export default MenuDesktop;
