export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-MX').format(number);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getStockStatus = (stock, stockMinimo, stockMaximo) => {
  if (stock <= stockMinimo) return 'bajo';
  if (stock >= stockMaximo) return 'suficiente';
  return 'medio';
};

// Obtener color según el stock
export const getStockColor = (stock, stockMinimo, stockMaximo) => {
  const status = getStockStatus(stock, stockMinimo, stockMaximo);
  switch (status) {
    case 'bajo':
      return 'text-red-600';
    case 'medio':
      return 'text-yellow-600';
    case 'suficiente':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

// Exportar datos a CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Obtener headers
  const headers = Object.keys(data[0]).join(',');
  
  // Convertir filas a CSV
  const rows = data.map(row => {
    return Object.values(row).map(value => {
      // Escapar comas y comillas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  }).join('\n');

  // Crear CSV
  const csv = `${headers}\n${rows}`;

  // Crear blob y descargar
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Debounce function para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};