import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../services/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import PoleImage from "../../public/image-login.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      const userCredential = await loginWithEmail(email, password);
      const uid = userCredential.user.uid;
      const userRef = doc(db, "users", uid);
      const snapshot = await getDoc(userRef);
      const role = snapshot.data()?.role || "user";
      role === "admin" ? navigate("/dashboard") : navigate("/perfil");
    } catch (error) {
      alert("Error al iniciar sesión. Verificá tus datos.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (!user) return;
      const role = user.role;
      role === "admin" ? navigate("/dashboard") : navigate("/perfil");
    } catch (error) {
      alert("No se pudo iniciar sesión con Google.");
    }
  };

  return (
          <div className="h-screen flex flex-col md:flex-row bg-gray-900 text-white font-sans">
  {/* Imagen lateral */}
  <div className="hidden md:block md:w-1/2 relative overflow-hidden">
    <img
      src={PoleImage}
      alt="pose de poledance"
      className="w-full h-full object-cover object-center max-h-screen opacity-60 blur-[1.5px]"
    />
    
    {/* Degradado sobre la imagen */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/20 pointer-events-none" />

    {/* Degradado hacia el formulario */}
    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent pointer-events-none" />
  </div>

  {/* Formulario */}
  <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-fuchsia-600">
      <h2 className="text-3xl font-bold mb-6 text-center text-fuchsia-400 drop-shadow-md">
        Iniciar sesión
      </h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />
        <button
          onClick={handleEmailLogin}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 rounded-lg transition shadow-md"
        >
          Iniciar sesión con email
        </button>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition shadow-md"
        >
          <FcGoogle className="text-xl" />
          Iniciar sesión con Google
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-300">
        ¿Aún no te registraste?{" "}
        <Link to="/registro" className="text-fuchsia-400 underline hover:text-fuchsia-300">
          Registrate acá
        </Link>
      </div>
    </div>
  </div>
</div>

  );
};

export default LoginPage;
