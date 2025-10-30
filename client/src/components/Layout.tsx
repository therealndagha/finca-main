// src/components/Layout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { navLinks } from "../utilis/NavLinks";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col p-4">
        <div className="mb-10 flex flex-col items-center">
          <img
            src="finca.webp"
            alt="Logo"
            className="w-28 cursor-pointer mb-3"
            onClick={() => navigate("/")}
          />
          <h2 className="text-xl font-semibold">FINCA System</h2>
        </div>

        <nav className="flex flex-col space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className="text-left px-4 py-2 rounded-md hover:bg-blue-800 transition"
            >
              {link.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet /> {/* Renders the page content */}
      </main>
    </div>
  );
}
