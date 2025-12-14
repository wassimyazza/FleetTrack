import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Camions", path: "/admin/trucks", icon: "🚛" },
    { name: "Remorques", path: "/admin/trailers", icon: "🚚" },
    { name: "Trajets", path: "/admin/trips", icon: "🗺️" },
    { name: "Maintenance", path: "/admin/maintenance", icon: "🔧" },
    { name: "Rapports", path: "/admin/reports", icon: "📈" },
  ];

  const driverLinks = [
    { name: "Mes Trajets", path: "/driver/trips", icon: "🗺️" },
  ];

  const links = user?.role === "admin" ? adminLinks : driverLinks;

  return (
    <div className="w-64 bg-gradient-to-b from-primary-800 to-primary-900 h-screen fixed left-0 top-0 text-white shadow-2xl">
      <div className="p-6 border-b border-primary-700">
        <h1 className="text-2xl font-bold">🚛 FleetFlow</h1>
        <p className="text-primary-200 text-sm mt-1">Gestion de Flotte</p>
      </div>

      <nav className="mt-6 px-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
              location.pathname === link.path
                ? "bg-primary-600 shadow-lg scale-105"
                : "hover:bg-primary-700"
            }`}
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
