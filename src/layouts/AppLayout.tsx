import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = () => {
  const { pathname } = useLocation();

  // Ocultar Navbar en login, registro y dashboard
  const hideNavbar = ["/login", "/registro", "/dashboard"].some(path =>
    pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {!hideNavbar && <Navbar />}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
