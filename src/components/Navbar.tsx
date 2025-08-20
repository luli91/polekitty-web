import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { collection} from "firebase/firestore";
import { db } from "../firebase";
import logo from "../../public/Polekitty-logo-blanco.png";
import { onSnapshot } from "firebase/firestore";

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notiMenuOpen, setNotiMenuOpen] = useState(false);
  const [notis, setNotis] = useState<{ id: string; mensaje: string; leida: boolean }[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/");
  };

 useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "notificaciones"), (snapshot) => {
    const mensajes = snapshot.docs
      .map(doc => ({
        id: doc.id,
        mensaje: doc.data().mensaje ?? "Se liberó un lugar en una clase",
        leida: false, // inicial
      }))
      .slice(0, 3); // opcional
    setNotis(mensajes);
  });

  return () => unsubscribe();
}, []);

  const mostrarPerfil = location.pathname !== "/perfil";

 const handleNotiClick = (id: string) => {
  setNotis(prev =>
    prev.map(n => n.id === id ? { ...n, leida: true } : n)
  );
  navigate("/calendario");
};


  return (
    <div className="w-full bg-gray-950 border-b border-fuchsia-700 shadow-md z-50">
      <nav className="px-6 py-4 flex items-center justify-between">
        {/* Logo + Título */}
        <div
          className="flex items-center gap-3 cursor-pointer hover:text-fuchsia-300 transition"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Polekitty logo" className="h-20 w-20 object-contain" />
          <span className="text-fuchsia-400 font-bold text-xl">Polekitty</span>
        </div>

        {/* Íconos de interacción */}
        <div className="flex items-center gap-4">
          {/* 🔔 Notificaciones */}
          <div className="relative">
            <FaBell
              className="text-2xl text-fuchsia-300 cursor-pointer hover:text-fuchsia-400 transition"
              onClick={() => {
                setNotiMenuOpen(!notiMenuOpen);
                setUserMenuOpen(false);
              }}
            />
            {notis.length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-fuchsia-500 rounded-full animate-ping"></span>
            )}
            {notiMenuOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg py-2 w-72 border border-fuchsia-700">
                <div className="px-4 py-2 text-white text-sm border-b border-fuchsia-600 font-semibold">
                  Notificaciones recientes
                </div>
                {notis.length > 0 ? (
                  notis.map((noti) => (
  <button
    key={noti.id}
    onClick={() => handleNotiClick(noti.id)}
    className={`px-4 py-2 text-sm w-full text-left break-words ${
      noti.leida
        ? "text-gray-400 bg-gray-900"
        : "text-white hover:bg-gray-700 font-semibold"
    }`}
  >
    🔔 {noti.mensaje}
  </button>
))

                ) : (
                  <p className="px-4 py-2 text-gray-400 text-sm">No hay notificaciones nuevas</p>
                )}
              </div>
            )}
          </div>

          {/* 👤 Menú de usuario */}
          <div className="relative">
            <FaUserCircle
              className="text-3xl text-fuchsia-300 cursor-pointer hover:text-fuchsia-400 transition"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotiMenuOpen(false);
              }}
            />
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg py-2 w-56 border border-fuchsia-700">
                {mostrarPerfil && (
                  <button
                    onClick={() => navigate("/perfil")}
                    className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
                  >
                    Mi perfil
                  </button>
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
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
