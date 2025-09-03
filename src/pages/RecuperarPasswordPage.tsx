import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { FaEnvelopeOpenText } from "react-icons/fa";

const RecuperarPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviado" | "error">("idle");
  const [mensaje, setMensaje] = useState("");

  const handleEnviar = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setEstado("enviado");
      setMensaje("Te enviamos un correo para que puedas recuperar tu contraseña.");
    } catch (error: any) {
      console.error("Error al enviar email de recuperación:", error);
      setEstado("error");
      setMensaje("No pudimos enviar el correo. Verificá el email ingresado.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-fuchsia-600 text-center">
        <FaEnvelopeOpenText className="text-4xl text-fuchsia-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-fuchsia-400">Recuperar contraseña</h2>
        <p className="text-sm text-gray-300 mb-6">
          Ingresá tu email y te enviaremos un enlace para crear una nueva contraseña.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 mb-4"
        />

        <button
          onClick={handleEnviar}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 rounded-lg transition shadow-md"
        >
          Enviar enlace de recuperación
        </button>

        {estado !== "idle" && (
          <p className={`mt-4 text-sm ${estado === "enviado" ? "text-green-400" : "text-red-400"}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecuperarPasswordPage;
