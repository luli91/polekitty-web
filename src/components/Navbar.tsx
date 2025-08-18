import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import logo from "../../public/Polekitty-logo-blanco.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notis, setNotis] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const fetchNotis = async () => {
      const snapshot = await getDocs(collection(db, "notificaciones"));
      const mensajes = snapshot.docs.map(doc => doc.data().mensaje);
      setNotis(mensajes.slice(0, 3)); // solo las 3 más recientes
    };

    fetchNotis();
  }, []);

  return (
    <div className="w-full bg-gray-950 border-b border-fuchsia-700 shadow-md z-50">
      {/* 🧭 Navbar principal */}
      <nav className="px-6 py-4 flex items-center justify-between">
        {/* Logo + Título */}
        <div
          className="flex items-center gap-3 cursor-pointer hover:text-fuchsia-300 transition"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Polekitty logo" className="h-20 w-20 object-contain" />
          <span className="text-fuchsia-400 font-bold text-xl">Polekitty</span>
        </div>

        {/* Menú de usuario */}
        <div className="relative">
          <FaUserCircle
            className="text-3xl text-fuchsia-300 cursor-pointer hover:text-fuchsia-400 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg py-2 w-48 border border-fuchsia-700">
               {/* 🔔 Notificaciones */}
                {notis.length > 0 && (
                  <div className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
                  {notis.map((msg, i) => (
                  <p key={i} className="truncate">🔔 {msg}</p>
                ))}
            </div>
             )}
              <button
                onClick={() => navigate("/calendario")}
                className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
              >
                Reservar clase
              </button>
              <button
                onClick={() => navigate("/eventos")}
                className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
              >
                Eventos
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-red-400 hover:bg-gray-700 w-full text-left"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
