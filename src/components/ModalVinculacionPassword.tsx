import { useState } from "react";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import ToastMensaje from "./ToastMensaje"; 

const ModalVinculacionPassword = ({ user }: { user: any }) => {
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState<"idle" | "vinculado" | "error">("idle");
  const [mostrarToast, setMostrarToast] = useState(false);

  const handleVincular = async () => {
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await linkWithCredential(auth.currentUser!, credential);
      await setDoc(doc(db, "users", user.uid), { passwordVinculado: true }, { merge: true });
      setMostrarToast(true);
      setEstado("vinculado");
    } catch (error) {
      console.error("Error al vincular contraseña:", error);
      setMostrarToast(true);
      setEstado("error");
    }
  };

  if (estado === "vinculado") return null;

  return (
    <>
      {mostrarToast && (
        <ToastMensaje
          mensaje={
            estado === "error"
              ? "⚠️ No se pudo actualizar la contraseña"
              : "🎉 Contraseña actualizada con éxito"
          }
          tipo={estado === "error" ? "error" : "exito"}
          onClose={() => setMostrarToast(false)}
        />
      )}

      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-fuchsia-600 max-w-sm w-full text-white">
          <h2 className="text-lg font-semibold mb-4 text-fuchsia-400 text-center">
            Actualizá tu contraseña
          </h2>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 mb-4"
          />
          <button
            onClick={handleVincular}
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 rounded-lg transition shadow-md"
          >
            Actualizar
          </button>
          {estado === "error" && (
            <p className="mt-4 text-sm text-red-400 text-center">
              ⚠️ Error al actualizar. Intentá de nuevo.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalVinculacionPassword;