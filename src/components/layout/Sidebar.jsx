import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  FolderOpen, 
  Warehouse, 
  Users 
} from 'lucide-react';

const Sidebar = ({ userRole }) => {
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

  // Filtrar menú según el rol del usuario
  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      {/* Logo/Título */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">MENÚ</h1>
      </div>

      {/* Menú de navegación */}
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredMenu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
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
    </aside>
  );
};

export default Sidebar;