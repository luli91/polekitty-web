import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../services/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
  const userCredential = await loginWithEmail(email, password);
  const uid = userCredential.user.uid;
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  const role = snapshot.data()?.role || "user";
  role === "admin" ? navigate("/dashboard") : navigate("/perfil");
};

  const handleGoogleLogin = async () => {
    const user = await loginWithGoogle();
    if (!user) return;
    const role = user.role;
    role === "admin" ? navigate("/dashboard") : navigate("/perfil");
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl mb-4">Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block mb-2 p-2 bg-white/10 rounded w-full"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block mb-4 p-2 bg-white/10 rounded w-full"
      />
      <button onClick={handleEmailLogin} className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded w-full mb-2">
        Iniciar sesión con email
      </button>
      <button onClick={handleGoogleLogin} className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded w-full">
        Iniciar sesión con Google
      </button>
      <div className="mt-4 text-sm">
        ¿No tenés cuenta? <Link to="/registro" className="underline text-pink-400">Registrate acá</Link>
      </div>
    </div>
  );
};

export default LoginPage;
