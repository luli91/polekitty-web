import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "../services/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

type FormFields = {
  nombre: string;
  apellido: string;
  edad: string;
  telefono: string;
  calle: string;
  numero: string;
  ciudad: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormFields>({
    nombre: "",
    apellido: "",
    edad: "",
    telefono: "",
    calle: "",
    numero: "",
    ciudad: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name as keyof FormFields]: e.target.value,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const campos = Object.values(form);
  const hayVacios = campos.some((valor) => valor.trim() === "");
  if (hayVacios) {
    alert("Por favor, completá todos los campos.");
    return;
  }

  const userCredential = await registerWithEmail(form.email, form.password);
  const uid = userCredential.user.uid;

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

  navigate("/perfil");
};

  return (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200 flex justify-center items-center">
    <form
      onSubmit={handleSubmit}
      className="bg-white/60 backdrop-blur-xl p-8 rounded-xl shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-pink-700 text-center">Registro</h2>

      {Object.entries(form).map(([field, value]) => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block text-pink-700 font-semibold mb-1 capitalize">
            {field}
          </label>
          <input
            id={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            value={value}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-pink-900"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition"
      >
        Registrarse
      </button>
    </form>
  </div>
);

};

export default RegisterPage;
