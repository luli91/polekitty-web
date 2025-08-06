import { useAuth } from "../context/AuthContext";

const PerfilPage = () => {
  const { user } = useAuth();

  if (!user) return <div className="text-white">Cargando perfil...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white/10 rounded-lg shadow-lg text-black">
      <h2 className="text-2xl font-bold mb-4">👤 Perfil de {user.displayName}</h2>
      <ul className="space-y-2">
        <li><strong>Nombre:</strong> {user.nombre}</li>
        <li><strong>Apellido:</strong> {user.apellido}</li>
        <li><strong>Edad:</strong> {user.edad}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Teléfono:</strong> {user.telefono}</li>
        <li><strong>Rol:</strong> {user.role}</li>
        <li><strong>Notificaciones:</strong> {user.notificacionesActivas ? "Activadas" : "Desactivadas"}</li>
        <li><strong>Dirección:</strong> {user.direccion?.calle} {user.direccion?.numero}, {user.direccion?.ciudad}</li>
      </ul>
    </div>
  );
};

export default PerfilPage;
