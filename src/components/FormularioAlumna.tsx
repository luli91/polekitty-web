import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export type FormFields = {
  nombre: string;
  apellido: string;
  edad: string;
  telefono: string;
  calle: string;
  numero: string;
  ciudad: string;
  email: string;
  password?: string;
    telefonoEmergencia1Nombre: string;
  telefonoEmergencia1Telefono: string;
};

interface Props {
  initialData?: FormFields;
  onSubmit: (form: FormFields) => void;
  includePassword?: boolean;
  useStepper?: boolean;
}

// ✅ COMPONENTE INPUT DEFINIDO FUERA DEL COMPONENTE PRINCIPAL
const Input = ({
  field,
  value,
  onChange,
  type = "text",
}: {
  field: keyof FormFields;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div>
    <label htmlFor={field} className="block text-fuchsia-300 font-medium mb-1 capitalize">
      {field}
    </label>
    <input
      id={field}
      type={type}
      name={field}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-gray-900 text-white placeholder-fuchsia-300"
      placeholder={`Ingresá tu ${field}`}
    />
  </div>
);

const FormularioAlumna = ({
  initialData,
  onSubmit,
  includePassword = false,
  useStepper = false,
}: Props) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormFields>(
    initialData || {
      nombre: "",
      apellido: "",
      edad: "",
      telefono: "",
      calle: "",
      numero: "",
      ciudad: "",
      email: "",
      password: "",  
      telefonoEmergencia1Nombre: "",
    telefonoEmergencia1Telefono: "",
    }
  );
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name as keyof FormFields]: e.target.value,
    }));

  const nextStep = () => {
  if (step === 0) {
    const camposPaso1 = ["nombre", "apellido", "edad", "telefono", "email", ...(includePassword ? ["password"] : [])];
    const hayVacios = camposPaso1.some((campo) => {
      const valor = form[campo as keyof FormFields];
      return !valor || valor.trim() === "";
    });

    if (hayVacios) {
      alert("Por favor, completá todos los campos del paso 1.");
      return;
    }
  }

  setStep(step + 1);
};

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const campos = Object.entries(form);

  const camposAValidar = useStepper
    ? step === 0
      ? campos.filter(([key]) =>
          ["nombre", "apellido", "edad", "telefono", "email", ...(includePassword ? ["password"] : [])].includes(key)
        )
      : campos.filter(([key]) => ["calle", "numero", "ciudad"].includes(key))
    : campos;

  const hayVacios = camposAValidar.some(([key, valor]) => {
    if (!includePassword && key === "password") return false;
    return valor.trim() === "";
  });

  if (hayVacios) {
    alert("Por favor, completá todos los campos.");
    return;
  }

  if (useStepper && step === 0) {
    nextStep();
    return;
  }

  onSubmit(form);
  setSuccess(true);
};


  const renderInputs = () => {
    const paso1 = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input field="nombre" value={form.nombre} onChange={handleChange} />
        <Input field="apellido" value={form.apellido} onChange={handleChange} />
        <Input field="edad" value={form.edad} onChange={handleChange} />
        <Input field="telefono" value={form.telefono} onChange={handleChange} />
        <Input field="email" value={form.email} onChange={handleChange} />
        {includePassword && (
  <div className="relative">
    <Input
      field="password"
      type={showPassword ? "text" : "password"}
      value={form.password || ""}
      onChange={handleChange}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-9 text-fuchsia-400 hover:text-fuchsia-300"
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
)}

      </div>
    );

    const paso2 = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input field="calle" value={form.calle} onChange={handleChange} />
        <Input field="numero" value={form.numero} onChange={handleChange} />
        <Input field="ciudad" value={form.ciudad} onChange={handleChange} />
        <Input field="telefonoEmergencia1Nombre" value={form.telefonoEmergencia1Nombre} onChange={handleChange} />
        <Input field="telefonoEmergencia1Telefono" value={form.telefonoEmergencia1Telefono} onChange={handleChange} />

      </div>
    );

    if (!useStepper) return <>{paso1}{paso2}</>;
    return step === 0 ? paso1 : paso2;
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      {success ? (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl text-center max-w-md w-full border border-fuchsia-600">
          <FaCheckCircle className="text-4xl text-fuchsia-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2 text-fuchsia-400">¡Registro exitoso!</h2>
          <p className="text-gray-300">Tu cuenta fue creada correctamente.</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-fuchsia-600"
        >
          <h2 className="text-3xl font-bold mb-6 text-violet-400 text-center tracking-wide">
            Registro de Alumna
          </h2>

          {useStepper && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === 0 ? "bg-fuchsia-600 text-white" : "bg-gray-700 text-gray-300"
                }`}>
                  1
                </div>
                <span className={`ml-2 text-sm ${
                  step === 0 ? "text-fuchsia-400" : "text-gray-400"
                }`}>
                  Datos personales
                </span>
              </div>
              <div className="flex-1 flex items-center justify-end">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === 1 ? "bg-violet-600 text-white" : "bg-gray-700 text-gray-300"
                }`}>
                  2
                </div>
                <span className={`ml-2 text-sm ${
                  step === 1 ? "text-violet-400" : "text-gray-400"
                }`}>
                  Dirección
                </span>
              </div>
            </div>
          )}

          {renderInputs()}

          <div className="flex justify-between mt-6">
  {useStepper && step > 0 && (
    <button
      type="button"
      onClick={prevStep}
      className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
    >
      Atrás
    </button>
  )}
  {useStepper && step < 1 ? (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault(); 
        nextStep();
      }}
      className="bg-fuchsia-600 px-4 py-2 rounded hover:bg-fuchsia-500 transition flex items-center gap-2"
    >
      Siguiente
    </button>
  ) : (
    <button
      type="submit"
      className="bg-violet-600 px-4 py-2 rounded hover:bg-violet-500 transition flex items-center gap-2 group"
    >
      <span>Registrarme</span>
      <FaCheckCircle className="text-white opacity-0 group-hover:opacity-100 transition duration-300" />
    </button>
  )}
</div>
        </form>
      )}
    </div>
  );
};

export default FormularioAlumna;
