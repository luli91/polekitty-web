import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import CalendarPage from "../pages/CalendarPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Gallery from "../pages/Gallery";
import About from "../pages/About";
import Landing from "../components/Landing";
import { useAuth } from "../context/AuthContext";
import RegistroPage from "../pages/RegisterPage";
import PerfilPage from "../pages/PerfilPage";


const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white">Cargando...</div>;

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/registro"
          element={!isLoggedIn ? <RegistroPage /> : <Navigate to="/perfil" />}
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute isAllowed={isLoggedIn}>
              <PerfilPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAllowed={isLoggedIn && isAdmin}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clases"
          element={
            <ProtectedRoute isAllowed={isLoggedIn}>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

