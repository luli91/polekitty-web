import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout"; 
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
import ListadoClase from "../pages/dashboard/ListadoClase";
import PagoExitoso from "../pages/PagoExitoso";
import PagoPack from "../components/PagoPack";
import RecuperarPasswordPage from "../pages/RecuperarPasswordPage";

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
          <Route path="/pago-pack"
          element={
            <ProtectedRoute isAllowed={isLoggedIn && !isAdmin}>
              <PagoPack />
            </ProtectedRoute>
          }
          />
          <Route path="/pago-exitoso" 
          element={
            <ProtectedRoute isAllowed={isLoggedIn && !isAdmin}>
              <PagoExitoso />
            </ProtectedRoute>
          } />          
          <Route
            path="/perfil"
            element={
              <ProtectedRoute isAllowed={isLoggedIn}>
                <PerfilPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
         path="/recuperar" 
         element={<RecuperarPasswordPage />

         } />

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
          <Route path="clases" element={<ListadoClase />} />
          <Route path="clienta/:uid" element={<PerfilClientaPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
