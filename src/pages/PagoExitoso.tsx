import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PagoExitoso = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/calendario"); 
    }, 3000); 

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="max-w-xl mx-auto mt-20 text-center text-white">
      <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 ¡Pago exitoso!</h2>
      <p className="text-sm text-gray-300 mb-2">
        Ya podés reservar tus clases mágicas. Tenés disponibles:{" "}
        <strong className="text-fuchsia-400">{user?.clasesDisponibles}</strong> clases.
      </p>
      <p className="text-xs text-gray-500 italic">Redirigiendo al calendario... 🪄</p>
    </div>
  );
};

export default PagoExitoso;
