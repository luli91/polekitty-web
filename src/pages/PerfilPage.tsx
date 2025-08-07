import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaCalendarCheck,
  FaPlusCircle,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Logo from "../../public/Polekitty-logo-blanco.png";

const PerfilPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm("¿Estás segura de que querés cerrar sesión?");
    if (confirmed) {
      const auth = getAuth();
      await signOut(auth);
      navigate("/");
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  if (!user) return <div className="text-white">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header móvil */}
      <header className="md:hidden flex justify-between items-center p-4 bg-purple-900 shadow-lg">
        <img src={Logo} alt="Logo" className="w-24 h-auto" />
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`md:static absolute top-0 left-0 h-full w-64 bg-purple-900 p-6 shadow-xl z-50 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 border-b md:border-b-0 md:border-r border-fuchsia-600`}
        >
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition">
              <img src={Logo} alt="Logo" className="w-28 h-auto drop-shadow-fuchsia" />
            </Link>

            <nav className="space-y-4">
              <button className="flex items-center gap-3 hover:text-fuchsia-400 transition">
                <FaHome /> Inicio
              </button>
              <button className="flex items-center gap-3 hover:text-fuchsia-400 transition">
                <FaUserEdit /> Editar perfil
              </button>
              <button className="flex items-center gap-3 hover:text-fuchsia-400 transition">
                <FaCalendarCheck /> Mis clases
              </button>
              <button className="flex items-center gap-3 hover:text-fuchsia-400 transition">
                <FaPlusCircle /> Agregar clase
              </button>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition mt-6"
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-6 text-fuchsia-400 drop-shadow-md">
            Bienvenida {capitalize(user.nombre)}
          </h2>

          <section className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-xl border border-fuchsia-600">
            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">Tus datos</h3>
            <ul className="space-y-2 text-gray-300">
              <li><strong>Nombre:</strong> {capitalize(user.nombre)}</li>
              <li><strong>Apellido:</strong> {capitalize(user.apellido)}</li>
              <li><strong>Edad:</strong> {user.edad}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Teléfono:</strong> {user.telefono}</li>
              <li><strong>Dirección:</strong> {user.direccion?.calle} {user.direccion?.numero}, {user.direccion?.ciudad}</li>
            </ul>
            <button className="mt-4 px-4 py-2 bg-fuchsia-600 text-white rounded-full hover:bg-fuchsia-700 transition shadow-md">
              Editar datos
            </button>
          </section>

          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">Clases anotadas</h3>
            <p className="text-gray-400">Aquí vas a ver las clases en las que estás anotada y podrás cancelarlas si lo necesitás.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PerfilPage;
