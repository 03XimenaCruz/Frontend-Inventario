import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Users, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';
import api from '../services/api';
import ReportModal from '../components/modals/ReportModal';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalUsers: 0,
    topExitsMonth: [],
    lowExitsMonth: [],
    lowStockAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      toast.error('Error al cargar las estadísticas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Paleta de colores
  const distinctColors = [
    '#3b82f6', 
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6', 
    '#ec4899', 
    '#06b6d4', 
    '#f97316', 
    '#14b8a6', 
    '#a855f7', 
  ];

  const distinctColorsLow = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white border-l-4 border-cyan-500 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Total de productos</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-600 mt-1 sm:mt-2">{stats.totalProducts}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-cyan-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-red-400 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Stock bajo</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mt-1 sm:mt-2">{stats.lowStockProducts}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-lime-500 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Total de usuarios</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-lime-600 mt-1 sm:mt-2">{stats.totalUsers}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-lime-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setIsReportModalOpen(true)}
          className="bg-white border-l-4 border-amber-500 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow transform hover:scale-105 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Generar reportes</p>
              <p className="text-gray-600 text-base sm:text-lg font-semibold mt-1 sm:mt-2">Click aquí</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Stock Bajo y Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Alertas de Stock Bajo - Izquierda en desktop */}
        {stats.lowStockAlerts && stats.lowStockAlerts.length > 0 && (
          <div className="lg:col-span-4">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-red-800">Productos con Stock Bajo</h3>
              </div>
              
              {/* Contenedor con scroll fijo */}
              <div className="overflow-y-auto space-y-2 pr-2" style={{ maxHeight: '520px' }}>
                {stats.lowStockAlerts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg p-3 sm:p-4 border border-red-200">
                    <div className="flex flex-col gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm sm:text-base text-gray-800">{product.nombre}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          SKU: {product.sku}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.categoria} | {product.almacen}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Stock actual</span>
                        <div className="text-right">
                          <p className="text-xl sm:text-2xl font-bold text-red-600">{product.stock}</p>
                          <p className="text-xs text-gray-500">Mín: {product.stock_minimo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Indicador de scroll si hay más de 3 productos */}
              {stats.lowStockAlerts.length > 3 && (
                <div className="text-center mt-2 text-xs text-red-600 font-medium">
                  ↓ Desplázate para ver más ({stats.lowStockAlerts.length} productos)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gráficas de Productos - Derecha en desktop (apiladas verticalmente) */}
        <div className={stats.lowStockAlerts && stats.lowStockAlerts.length > 0 ? "xl:col-span-8" : "xl:col-span-12"}>
          <div className={stats.lowStockAlerts && stats.lowStockAlerts.length > 0 ? "space-y-4 sm:space-y-6" : "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"}>
            {/* Productos MÁS VENDIDOS */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Top productos más vendidos
              </h2>
              
              {stats.topExitsMonth && stats.topExitsMonth.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={stats.lowExitsMonth.length <= 3 ? 180 : stats.lowExitsMonth.length * 55}>
                    <BarChart 
                      data={stats.topExitsMonth} 
                      layout="vertical"
                      margin={{ top: 5, right: 80, left: 5, bottom: 5 }}
                      barSize={35}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number"
                        tick={{ fontSize: 12, fill: '#374151' }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="nombre" 
                        width={150}
                        tick={{ fontSize: 11, fill: '#374151' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '2px solid #06b6d4', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          fontSize: '12px'
                        }}
                        formatter={(value) => [value, 'Unidades']}
                        labelFormatter={(label) => `Producto: ${label}`}
                      />
                      <Bar 
                        dataKey="total_vendido" 
                        radius={[0, 8, 8, 0]}
                        label={{ 
                          position: 'right', 
                          fill: '#374151',
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}
                      >
                        {stats.topExitsMonth.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={distinctColors[index % distinctColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Package size={40} className="mb-3 opacity-50" />
                  <p className="text-center text-sm">No hay movimientos de salida este mes</p>
                </div>
              )}
            </div>

            {/* Productos MENOS VENDIDOS */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Top productos menos vendidos
              </h2>
              
              {stats.lowExitsMonth && stats.lowExitsMonth.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={stats.lowExitsMonth.length <= 3 ? 180 : stats.lowExitsMonth.length * 55}>
                    <BarChart 
                      data={stats.lowExitsMonth} 
                      layout="vertical"
                      margin={{ top: 5, right: 80, left: 5, bottom: 5 }}
                      barSize={35}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number"
                        tick={{ fontSize: 12, fill: '#374151' }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="nombre" 
                        width={150}
                        tick={{ fontSize: 11, fill: '#374151' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '2px solid #f97316', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          fontSize: '12px'
                        }}
                        formatter={(value) => [value, 'Unidades']}
                        labelFormatter={(label) => `Producto: ${label}`}
                      />
                      <Bar 
                        dataKey="total_vendido" 
                        radius={[0, 8, 8, 0]}
                        label={{ 
                          position: 'right', 
                          fill: '#374151',
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}
                      >
                        {stats.lowExitsMonth.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={distinctColorsLow[index % distinctColorsLow.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Package size={40} className="mb-3 opacity-50" />
                  <p className="text-center text-sm">No hay datos de salidas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;