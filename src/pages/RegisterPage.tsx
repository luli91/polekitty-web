import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "../services/auth";
import {
  setDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import FormularioAlumna from "../components/FormularioAlumna";
import type { FormFields } from "../components/FormularioAlumna";
import PoleImage from "../../public/registerphoto.jpeg";
import { useAuth } from "../context/AuthContext";
import type { UserData } from "../types"; 


const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (form: FormFields) => {
    try {
      const userCredential = await registerWithEmail(form.email, form.password!);
      const uid = userCredential.user.uid;

      const q = query(collection(db, "users"), where("email", "==", form.email));
      const snapshot = await getDocs(q);

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
        role: "user",
        cuentaCreada: true,
        notificacionesActivas: true,
        puedeAnotarse: false,
        clasesReservadas: [],
      };

      if (!snapshot.empty) {
        const existingDocRef = snapshot.docs[0].ref;
        await setDoc(existingDocRef, userData, { merge: true });
        console.log("Perfil existente actualizado con UID de Auth.");
      } else {
        const newDocRef = doc(db, "users", uid);
        await setDoc(newDocRef, userData);
        console.log("Nuevo perfil creado.");
      }

      setUser(userData);
      navigate("/perfil");
    } catch (error) {
      console.error("Error en el registro:", error);
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
    
    {/* Degradado sobre la imagen */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none" />

    {/* Degradado hacia el formulario */}
    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent pointer-events-none" />
  </div>

  {/* Formulario */}
  <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
    <FormularioAlumna onSubmit={handleSubmit} includePassword useStepper />
  </div>
</div>

  );
};

export default RegisterPage;
