import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Logo from "../../public/Polekitty-logo-blanco.png";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import {
  FaUserFriends,
  FaCalendarAlt,
  FaVideo,
  FaRegCalendarPlus,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const sections = [
    { label: "Clases", path: "/dashboard/clases", icon: <FaCalendarAlt /> },
    { label: "Videos", path: "/dashboard/videos", icon: <FaVideo /> },
    { label: "Eventos", path: "/dashboard/eventos", icon: <FaRegCalendarPlus /> },
    { label: "Notificaciones", path: "/dashboard/notificaciones", icon: <FaBell /> },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/");
  };

  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between h-screen">
      <div>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition">
          <img src={Logo} alt="Logo" className="w-25 h-35" />
        </Link>

        {/* Secciones */}
        <ul className="space-y-4 text-white">
          {/* Alumnas con submenú */}
          <Disclosure>
            {({ open }) => (
              <div>
                <DisclosureButton className="flex justify-between items-center w-full px-2 py-2 text-left hover:text-pink-400 transition">
                  <div className="flex items-center gap-3">
                    <FaUserFriends className="text-lg group-hover:text-pink-400 transition" />
                    <span>Alumnas</span>
                  </div>
                  <ChevronUpIcon
                    className={`w-5 h-5 transform ${open ? "rotate-180" : ""}`}
                  />
                </DisclosureButton>
                <DisclosurePanel className="pl-9 mt-2 space-y-2">
                  <Link to="/dashboard/alumnas" className="block hover:text-pink-400 transition">
                    Listado
                  </Link>
                  <Link to="/dashboard/agregar-alumna" className="block hover:text-pink-400 transition">
                    Agregar
                  </Link>
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>

          {/* Otras secciones con íconos */}
          {sections.map(({ label, path, icon }) => (
            <li key={label}>
              <Link
                to={path}
                className="flex items-center gap-3 hover:text-pink-400 transition"
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition"
      >
        <FaSignOutAlt className="text-lg" />
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
