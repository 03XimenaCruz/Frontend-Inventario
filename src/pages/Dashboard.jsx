import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Users, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
    } finally {
      setLoading(false);
    }
  };

  const COLORS_TOP = ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#0c4a6e', '#075985', '#0369a1', '#0284c7', '#38bdf8'];
  const COLORS_LOW = ['#f59e0b', '#f97316', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#fb923c', '#fdba74', '#fed7aa'];

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
        <div className="bg-cyan-50 border-l-4 border-cyan-500 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
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

        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
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

        <div className="bg-stone-200 border-l-4 border-stone-500 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Total de usuarios</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-600 mt-1 sm:mt-2">{stats.totalUsers}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-stone-300 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-stone-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setIsReportModalOpen(true)}
          className="bg-gradient-to-br from-orange-400 to-cyan-500 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-xs sm:text-sm font-medium">Generar reportes</p>
              <p className="text-white text-base sm:text-lg font-semibold mt-1 sm:mt-2">Click aquí</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Stock Bajo */}
      {stats.lowStockAlerts && stats.lowStockAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-1 flex-shrink-0" />
            <div className="flex-1 w-full">
              <h3 className="text-base sm:text-lg font-bold text-red-800 mb-3">Productos con stock Bajo</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {stats.lowStockAlerts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg p-3 sm:p-4 border border-red-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-sm sm:text-base text-gray-800">{product.nombre}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          SKU: {product.sku} | {product.categoria} | {product.almacen}
                        </p>
                      </div>
                      <div className="text-left sm:text-right flex items-center sm:flex-col gap-3 sm:gap-0">
                        <p className="text-xl sm:text-2xl font-bold text-red-600">{product.stock}</p>
                        <p className="text-xs text-gray-500">Mín: {product.stock_minimo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficas de Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Productos MÁS VENDIDOS */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Productos Más Vendidos
          </h2>
          
          {stats.topExitsMonth && stats.topExitsMonth.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={280} className="sm:h-80">
                  <BarChart data={stats.topExitsMonth} margin={{ top: 20, right: 10, left: 0, bottom: 85 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="sku" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      tick={{ fontSize: 10, fill: '#374151' }}
                      className="text-xs sm:text-sm"
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#374151' }} className="text-xs sm:text-sm" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #06b6d4', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [value, 'Movimientos']}
                      labelFormatter={(label) => {
                        const item = stats.topExitsMonth.find(i => i.sku === label);
                        return item ? `${item.nombre}` : label;
                      }}
                    />
                    <Bar dataKey="total_vendido" radius={[8, 8, 0, 0]}>
                      {stats.topExitsMonth.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_TOP[index % COLORS_TOP.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 sm:mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                  <thead className="bg-cyan-50">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">#</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Producto</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                      <th className="px-2 sm:px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.topExitsMonth.map((item, index) => (
                      <tr key={index} className="hover:bg-cyan-50 transition-colors">
                        <td className="px-2 sm:px-3 py-2 font-bold text-cyan-600">{index + 1}</td>
                        <td className="px-2 sm:px-3 py-2 text-gray-700">{item.nombre}</td>
                        <td className="px-2 sm:px-3 py-2 text-gray-500">{item.sku}</td>
                        <td className="px-2 sm:px-3 py-2 font-semibold text-cyan-600 text-right">{item.total_vendido}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
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
            Productos Menos Vendidos
          </h2>
          
          {stats.lowExitsMonth && stats.lowExitsMonth.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={280} className="sm:h-80">
                  <BarChart data={stats.lowExitsMonth} margin={{ top: 20, right: 10, left: 0, bottom: 85 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="sku" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      tick={{ fontSize: 10, fill: '#374151' }}
                      className="text-xs sm:text-sm"
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#374151' }} className="text-xs sm:text-sm" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #f97316', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [value, 'Unidades vendidas']}
                      labelFormatter={(label) => {
                        const item = stats.lowExitsMonth.find(i => i.sku === label);
                        return item ? `${item.nombre}` : label;
                      }}
                    />
                    <Bar dataKey="total_vendido" radius={[8, 8, 0, 0]}>
                      {stats.lowExitsMonth.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_LOW[index % COLORS_LOW.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 sm:mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">#</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">Producto</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                      <th className="px-2 sm:px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.lowExitsMonth.map((item, index) => (
                      <tr key={index} className="hover:bg-orange-50 transition-colors">
                        <td className="px-2 sm:px-3 py-2 font-bold text-orange-600">{index + 1}</td>
                        <td className="px-2 sm:px-3 py-2 text-gray-700">{item.nombre}</td>
                        <td className="px-2 sm:px-3 py-2 text-gray-500">{item.sku}</td>
                        <td className="px-2 sm:px-3 py-2 font-semibold text-orange-600 text-right">
                          {item.total_salidas === 0 ? '0 (Sin ventas)' : item.total_vendido}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Package size={40} className="mb-3 opacity-50" />
              <p className="text-center text-sm">No hay datos de salidas</p>
            </div>
          )}
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