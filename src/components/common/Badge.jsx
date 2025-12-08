import { AlertTriangle, TrendingUp, CheckCircle, Package } from 'lucide-react';

const Badge = ({ type, text, icon, className = '' }) => {
  const types = {
    // Estados de stock
    bajo: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: AlertTriangle,
      defaultText: 'Stock bajo'
    },
    medio: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: TrendingUp,
      defaultText: 'Stock medio'
    },
    suficiente: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: CheckCircle,
      defaultText: 'Stock suficiente'
    },
    
    // Tipos de movimiento
    entrada: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: null,
      defaultText: 'entrada'
    },
    salida: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: null,
      defaultText: 'salida'
    },
    
    // Roles
    administrador: {
      bg: 'bg-lime-100',
      text: 'text-lime-700',
      icon: null,
      defaultText: 'Administrador'
    },
    colaborador: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      icon: null,
      defaultText: 'Colaborador'
    },
    
    // Almacén
    almacen: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      //icon: Package,
      defaultText: 'Almacén'
    }
  };
  
  const config = types[type] || types.medio;
  const Icon = icon || config.icon;
  const displayText = text || config.defaultText;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {Icon && <Icon size={14} />}
      {displayText}
    </span>
  );
};

export default Badge;