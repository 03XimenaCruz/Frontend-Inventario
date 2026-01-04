import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  FolderOpen, 
  Warehouse, 
  Users,
  User,
  LogOut,
  ChevronUp,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ userRole, isOpen, onClose }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['administrador', 'colaborador']
    },
    {
      name: 'Productos',
      path: '/productos',
      icon: Package,
      roles: ['administrador', 'colaborador']
    },
    {
      name: 'Movimientos',
      path: '/movimientos',
      icon: TrendingUp,
      roles: ['administrador', 'colaborador']
    },
    {
      name: 'Stock',
      path: '/stock',
      icon: AlertTriangle,
      roles: ['administrador', 'colaborador']
    },
    {
      name: 'Categorías',
      path: '/categorias',
      icon: FolderOpen,
      roles: ['administrador']
    },
    {
      name: 'Almacenes',
      path: '/almacenes',
      icon: Warehouse,
      roles: ['administrador']
    },
    {
      name: 'Usuarios',
      path: '/usuarios',
      icon: Users,
      roles: ['administrador']
    }
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLinkClick = () => {
    // Cerrar sidebar en móvil/tablet al hacer click en un link
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para móvil/tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-white shadow-lg z-50 flex flex-col
        transition-transform duration-300 ease-in-out
        w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header con botón de cierre para móvil */}
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">MENÚ</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {filteredMenu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Usuario */}
        <div className="mt-auto border-t border-gray-200 p-4 relative" ref={userMenuRef}>
          {showUserMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 lg:bottom-0 lg:left-full lg:ml-2 lg:right-auto w-auto lg:w-64 bg-white rounded-lg border border-gray-200 shadow-xl z-50">
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                  <p className="text-xs text-gray-500 mt-1">{user?.correo}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                  user?.rol === 'administrador' 
                    ? 'bg-cyan-100 text-cyan-800' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {user?.rol === 'administrador' ? 'Administrador' : 'Colaborador'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 rounded-b-lg"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Cerrar sesión</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-white" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="font-medium text-gray-900 text-sm truncate">{user?.nombre || 'Usuario'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.rol === 'administrador' ? 'Admin' : 'Colaborador'}</p>
              </div>
            </div>
            <ChevronUp 
              size={18} 
              className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-0' : 'rotate-180'}`} 
            />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;