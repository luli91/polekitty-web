import { useState, useEffect } from "react";
import { FaMagic } from "react-icons/fa";

interface Props {
  label: string;
  campo: string;
  valor: string;
  onGuardar: (campo: string, nuevoValor: string) => Promise<void>;
}

const CampoEditable = ({ label, campo, valor, onGuardar }: Props) => {
  const [editando, setEditando] = useState(false);
  const [valorEditado, setValorEditado] = useState(valor);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditando(false);
        setValorEditado(valor);
      }
    };

    if (editando) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editando, valor]);

  const handleGuardar = async () => {
    await onGuardar(campo, valorEditado);
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
  <li className="relative bg-gray-700 rounded-lg p-3 border-l-4 border-fuchsia-500 space-y-2 transition-all">
    <label className="text-sm font-semibold text-fuchsia-300">{label}</label>

    {editando ? (
      <div className="flex items-center gap-2">
        <input
          value={valorEditado}
          onChange={(e) => setValorEditado(e.target.value)}
          className="bg-gray-900 text-white p-2 rounded border border-fuchsia-500 w-full"
        />
        <button
          onClick={handleGuardar}
          className="text-sm text-fuchsia-400 hover:underline"
        >
          Guardar
        </button>
      </div>
    ) : (
      <p className="text-white text-base break-words whitespace-normal">{valor}</p>
    )}

    {!editando && (
      <button
        onClick={() => {
          setEditando(true);
          setValorEditado(valor);
        }}
        className="absolute top-2 right-2 hover:scale-110 transition"
        title="Editar campo"
      >
        <FaMagic className="text-violet-400 hover:text-violet-500 text-lg" />
      </button>
    )}

    {guardado && (
      <p className="text-green-400 text-sm mt-1">✨ ¡Dato actualizado con éxito!</p>
    )}
  </li>
);

};

export default CampoEditable;
