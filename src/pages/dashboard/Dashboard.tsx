import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-100 text-black">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

