import { useNavigate } from "react-router-dom";

interface AvisoPagoProps {
  onClose: () => void;
}

const AvisoPago: React.FC<AvisoPagoProps> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-fuchsia-950 text-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <p className="text-xl font-bold mb-2">💸 Aún no abonaste tu pack</p>
        <p className="text-sm text-fuchsia-300 mb-4">
          Pagá tu pack mensual para habilitar tus clases mágicas ✨
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/pago-pack")}
            className="bg-fuchsia-600 px-4 py-2 rounded hover:bg-fuchsia-700"
          >
            Ir a pagar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvisoPago;
