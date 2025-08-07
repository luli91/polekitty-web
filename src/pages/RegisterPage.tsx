import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "../services/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import FormularioAlumna from "../components/FormularioAlumna";
import type { FormFields } from "../components/FormularioAlumna";
import PoleImage from "../../public/image-login.jpg";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (form: FormFields) => {
    try {
      // 1. Registrar en Firebase Auth
      const userCredential = await registerWithEmail(form.email, form.password!);
      const uid = userCredential.user.uid;

      // 2. Buscar si ya existe un perfil con ese email
      const q = query(collection(db, "users"), where("email", "==", form.email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // 3. Ya existe: actualizar el documento con el nuevo UID y marcar cuenta creada
        const existingDocRef = snapshot.docs[0].ref;

        await setDoc(existingDocRef, {
          uid,
          cuentaCreada: true,
          displayName: form.nombre,
          nombre: form.nombre,
          apellido: form.apellido,
          edad: Number(form.edad),
          telefono: form.telefono,
          direccion: {
            calle: form.calle,
            numero: form.numero,
            ciudad: form.ciudad,
          },
        }, { merge: true });

        console.log("Perfil existente actualizado con UID de Auth.");
      } else {
        // 4. No existe: crear nuevo documento
        await setDoc(doc(db, "users", uid), {
          uid,
          cuentaCreada: true,
          displayName: form.nombre,
          email: form.email,
          role: "user",
          notificacionesActivas: true,
          clasesReservadas: [],
          nombre: form.nombre,
          apellido: form.apellido,
          edad: Number(form.edad),
          telefono: form.telefono,
          direccion: {
            calle: form.calle,
            numero: form.numero,
            ciudad: form.ciudad,
          },
        });

        console.log("Nuevo perfil creado.");
      }

      // 5. Redirigir al perfil
      navigate("/perfil");
    } catch (error) {
      console.error("Error en el registro:", error);
      // Podés mostrar un mensaje de error visual acá
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
