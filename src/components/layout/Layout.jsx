import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Sidebar 
        userRole={user?.rol} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header con botón de menú para móvil/tablet */}
        <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">Sistema de Inventario</h2>
            <div className="w-10" />
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;