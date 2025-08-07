import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import FormularioAlumna from "../../../components/FormularioAlumna";
import type { FormFields } from "../../../components/FormularioAlumna";

const AgregarAlumnaPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (form: FormFields) => {
    const uid = crypto.randomUUID(); 

    await setDoc(doc(db, "users", uid), {
      uid,
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

    navigate("/admin/alumnas");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200 flex justify-center items-center">
      <FormularioAlumna onSubmit={handleSubmit} includePassword={false} />
    </div>
  );
};

export default AgregarAlumnaPage;
