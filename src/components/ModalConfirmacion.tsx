interface ModalProps {
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ModalConfirmacion = ({ mensaje, onConfirmar, onCancelar }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <p className="mb-4">{mensaje}</p>
        <div className="flex justify-end gap-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancelar}>Cancelar</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
