import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ToastMensaje from "./ToastMensaje";

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
  telefonoEmergenciaNombre: string;
  telefonoEmergenciaTelefono: string;
};

interface Props {
  initialData?: FormFields;
  onSubmit: (form: FormFields) => Promise<{ ok: boolean; error?: string }>;
  includePassword?: boolean;
  useStepper?: boolean;
}

const Input = ({
  field,
  value,
  onChange,
  type = "text",
  label,
  placeholder,
}: {
  field: keyof FormFields;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  label?: string;
  placeholder?: string;
}) => (
  <div>
    <label htmlFor={field} className="block text-fuchsia-300 font-medium mb-1 capitalize">
       {label || field}
    </label>
    <input
      id={field}
      type={type}
      name={field}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-gray-900 text-white placeholder-fuchsia-300"
      placeholder={placeholder || `Ingresá tu ${label || field}`}
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
      telefonoEmergenciaNombre: "",
      telefonoEmergenciaTelefono: "",
    }
  );
  const [success, setSuccess] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ mensaje: string; tipo: "exito" | "error" | "info" } | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name as keyof FormFields]: e.target.value,
    }));
    
  const showToast = (mensaje: string, tipo: "exito" | "error" | "info" = "info") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

const nextStep = () => {
  if (step === 0) {
    const camposPaso1 = ["nombre", "apellido", "edad", "telefono", "email", ...(includePassword ? ["password"] : [])];
    const vacios = camposPaso1.some((campo) => !form[campo as keyof FormFields]?.trim());

     if (vacios) {
        showToast("Por favor, completá todos los datos personales.", "error");
        return;
      }
      if (includePassword && form.password && form.password.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
      }
  }

  setStep(step + 1);
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSuccess(null);
  // Solo validar todo si estamos en el último paso
  if (useStepper && step === 0) {
    nextStep(); // Avanzar sin validar campos del paso 2
    return;
  }
  // Validar solo los campos del paso 2
    const camposPaso2 = [
      "calle",
      "numero",
      "ciudad",
      "telefonoEmergenciaNombre",
      "telefonoEmergenciaTelefono"
    ];

  const vacios = camposPaso2.some((campo) => !form[campo as keyof FormFields]?.trim());
    if (vacios) {
      showToast("Por favor, completá todos los campos.", "error");
      return;
    }
    const resultado = await onSubmit(form); 

    if (resultado.ok) {
      setSuccess(true);
    } else {
      showToast(resultado.error || "Error al registrar.", "error");
      setSuccess(false); 
    }
  };

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
      label="Contraseña"
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
        <div className="md:col-span-2 mt-4">
        <h3 className="text-lg font-semibold text-fuchsia-400 mb-2">Contacto de Emergencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            field="telefonoEmergenciaNombre"
            label="Nombre"
            value={form.telefonoEmergenciaNombre}
            onChange={handleChange}
          />
          <Input
            field="telefonoEmergenciaTelefono"
            label="Teléfono"
            value={form.telefonoEmergenciaTelefono}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      {toast && <ToastMensaje mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
      {success === true ? (
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
          <h2 className="text-3xl font-bold mb-6 text-violet-400 text-center">Registro de Alumna</h2>
          {useStepper && (
            <div className="flex items-center justify-between mb-6">
              {[0, 1].map((i) => (
                <div key={i} className={`flex-1 flex items-center ${i === 1 ? "justify-end" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step === i ? "bg-fuchsia-600 text-white" : "bg-gray-700 text-gray-300"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`ml-2 text-sm ${step === i ? "text-fuchsia-400" : "text-gray-400"}`}>
                    {i === 0 ? "Datos personales" : "Dirección"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {useStepper ? (step === 0 ? paso1 : paso2) : (<>{paso1}{paso2}</>)}

          <div className="flex justify-between mt-6">
            {useStepper && step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                Atrás
              </button>
            )}
            {useStepper && step === 0 && (
              <button
                type="button"
                onClick={nextStep}
                className="bg-fuchsia-600 px-4 py-2 rounded hover:bg-fuchsia-500"
              >
                Siguiente
              </button>
            )}

            {useStepper && step === 1 && (
              <button
                type="submit"
                className="bg-violet-600 px-4 py-2 rounded hover:bg-violet-500 flex items-center gap-2"
              >
                <span>Registrarme</span>
                <FaCheckCircle className="text-white opacity-0 group-hover:opacity-100 transition" />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default FormularioAlumna;
