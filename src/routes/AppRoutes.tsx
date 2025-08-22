import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout"; // 💜 nuevo layout
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
import CalendarPage from "../pages/CalendarPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Gallery from "../pages/Gallery";
import About from "../pages/About";
import Landing from "../components/Landing";
import { useAuth } from "../context/AuthContext";
import RegistroPage from "../pages/RegisterPage";
import PerfilPage from "../pages/PerfilPage";
import Alumnas from "../pages/dashboard/alumnas/Alumnas";
import MainPanel from "../components/MainPanel";
import PerfilClientaPage from "../pages/dashboard/alumnas/PerfilClientaPage";
import AgregarAlumnaPage from "../pages/dashboard/alumnas/AgregarAlumnaPage";
import ListadoClase from "../pages/dashboard/ListadoClase";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white">Cargando...</div>;

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <Routes>
        {/* Rutas públicas con Navbar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route
            path="/calendario"
            element={
              <ProtectedRoute isAllowed={isLoggedIn && !isAdmin}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute isAllowed={isLoggedIn}>
                <PerfilPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Rutas sin Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/registro"
          element={!isLoggedIn ? <RegistroPage /> : <Navigate to="/perfil" />}
        />

        {/* Dashboard con layout propio */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAllowed={isLoggedIn && isAdmin}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<MainPanel />} />
          <Route path="alumnas" element={<Alumnas />} />
          <Route path="agregar-alumna" element={<AgregarAlumnaPage />} />
          <Route path="clases" element={<ListadoClase />} />
          <Route path="clienta/:uid" element={<PerfilClientaPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
