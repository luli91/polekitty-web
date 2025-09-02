import { useState, useEffect } from "react";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded text-white shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 p-6 flex flex-col justify-between z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div>
          {/* Cerrar en mobile */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setIsOpen(false)} className="text-white">
              <FaTimes size={20} />
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition">
            <img src={Logo} alt="Logo" className="w-28 h-auto" />
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
                  onClick={() => setIsOpen(false)} // cerrar en mobile
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
    </>
  );
};

export default Sidebar;
