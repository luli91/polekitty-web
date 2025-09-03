import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerWithEmail } from "../services/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import FormularioAlumna from "../components/FormularioAlumna";
import type { FormFields } from "../components/FormularioAlumna";
import PoleImage from "../../public/registerphoto.jpeg";
import { useAuth } from "../context/AuthContext";
import type { UserData } from "../types";
import { crearUserFlags } from "../services/userFlagsService";
import { useLocation } from "react-router-dom";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { auth } from "../firebase";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const location = useLocation();
  const datosGoogle = location.state || {};

  const handleSubmit = async (form: FormFields) => {
    setError("");

    const uidDesdeGoogle = datosGoogle.uid;

    try {
      let uid: string;

      if (uidDesdeGoogle) {
        // Ya está autenticada por Google, no crear usuario en Auth
        uid = uidDesdeGoogle;

        // 🛡️ Vincular contraseña si la escribió
        if (form.password && form.password.length >= 6) {
          const credential = EmailAuthProvider.credential(form.email, form.password);
          try {
            await linkWithCredential(auth.currentUser!, credential);
            console.log("🔗 Proveedor password vinculado exitosamente");
          } catch (linkError: any) {
            console.error("❌ Error al vincular password:", linkError);
            if (linkError.code === "auth/provider-already-linked") {
              console.log("⚠️ El proveedor ya estaba vinculado");
            }
          }
        }
      } else {
        // Registro tradicional
        if (!form.password || form.password.length < 6) {
          return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
        }

        const userCredential = await registerWithEmail(form.email, form.password);
        uid = userCredential.user.uid;
      }

      const userData: UserData = {
        uid,
        email: form.email,
        displayName: form.nombre,
        nombre: form.nombre,
        apellido: form.apellido,
        edad: Number(form.edad) || null,
        telefono: form.telefono,
        direccion: {
          calle: form.calle,
          numero: form.numero,
          ciudad: form.ciudad,
        },
        telefonoEmergencia1: {
          nombre: form.telefonoEmergenciaNombre,
          telefono: form.telefonoEmergenciaTelefono,
        },
        role: "user",
        cuentaCreada: true,
        notificacionesActivas: true,
        puedeAnotarse: false,
        clasesReservadas: [],
        clasesDisponibles: 0,
      };

      await setDoc(doc(db, "users", uid), userData);
      await crearUserFlags(uid);

      setUser(userData);
      navigate("/perfil");

      return { ok: true };
    } catch (error: any) {
      console.error("Error en el registro:", error);

      if (error.code === "auth/email-already-in-use") {
        return {
          ok: false,
          error: "Este email ya está registrado. ¿Querés iniciar sesión con Google?",
        };
      }

      return { ok: false, error: "No se pudo completar el registro." };
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950 text-white font-sans">
      {/* Imagen lateral */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src={PoleImage}
          alt="Pole dance neon silhouette"
          className="w-full h-full object-cover object-center max-h-screen opacity-60 blur-[1.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent pointer-events-none" />
      </div>

      {/* Formulario */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        {error && (
          <p className="text-red-500 font-semibold mb-4 text-center">{error}</p>
        )}
        <FormularioAlumna onSubmit={handleSubmit} includePassword useStepper />
      </div>
    </div>
  );
};

export default RegisterPage;
