import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Sidebar */}
      <Sidebar userRole={user?.rol} />

      {/* Contenedor principal */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header />

        {/* Contenido principal */}
        <main className="pt-16 min-h-screen">
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;