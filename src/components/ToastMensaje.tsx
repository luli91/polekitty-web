import { useEffect } from "react";

interface ToastMensajeProps {
  mensaje: string;
  tipo?: "exito" | "error" | "info";
  onClose: () => void;
}

const ToastMensaje = ({ mensaje, tipo = "info", onClose }: ToastMensajeProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colores = {
    exito: "bg-green-600 border-green-400 text-white",
    error: "bg-red-600 border-red-400 text-white",
    info: "bg-fuchsia-700 border-fuchsia-500 text-white",
  };

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg border ${colores[tipo]} animate-fade-in`}>
      <p className="text-sm font-medium">{mensaje}</p>
    </div>
  );
};

export default ToastMensaje;
