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

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (form: FormFields) => {
    setError("");

    // 1️⃣ Validación de contraseña antes de llamar a Firebase
    if (!form.password || form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // 2️⃣ Crear usuario en Auth
      const userCredential = await registerWithEmail(form.email, form.password);
      const uid = userCredential.user.uid;

      // 3️⃣ Datos del usuario a guardar en Firestore
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
          nombre: form.telefonoEmergencia1Nombre,
          telefono: form.telefonoEmergencia1Telefono,
        },
        role: "user",
        cuentaCreada: true,
        notificacionesActivas: true,
        puedeAnotarse: false,
        clasesReservadas: [],
      };

      // 4️⃣ Guardar usuario en /users/{uid}
      await setDoc(doc(db, "users", uid), userData);

      // 5️⃣ Crear userFlags en /userFlags/{uid}
      await crearUserFlags(uid);

      // 6️⃣ Setear usuario en contexto y navegar
      setUser(userData);
      navigate("/perfil");
    } catch (error: any) {
      console.error("Error en el registro:", error);
      if (error.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil (mínimo 6 caracteres).");
      } else if (error.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado.");
      } else {
        setError("Error al registrar usuario. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-950 text-white font-sans">
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

