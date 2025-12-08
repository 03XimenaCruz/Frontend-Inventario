import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Users, FileText } from 'lucide-react';
import api from '../services/api';
import ReportModal from '../components/modals/ReportModal';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalUsers: 0,
    topEntriesMonth: [],
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de productos */}
        <div className="bg-white border-l-4 border-primary rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de productos</p>
              <p className="text-4xl font-bold text-cyan-600 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center">
              <Package size={28} className="text-cyan-600" />
            </div>
          </div>
        </div>

        {/* Stock bajo */}
        <div className="bg-white border-l-4 border-red-400 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Stock bajo</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{stats.lowStockProducts}</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Total usuarios */}
        <div className="bg-white border-l-4 border-slate-500 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de usuarios</p>
              <p className="text-4xl font-bold text-slate-500 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
              <Users size={28} className="text-slate-600" />
            </div>
          </div>
        </div>

        {/* Generar reportes (clickeable) */}
        <div 
          onClick={() => setIsReportModalOpen(true)}
          className="bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Generar reportes</p>
              <p className="text-white text-lg font-semibold mt-2">Click aquí</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FileText size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de productos con stock bajo */}
      {stats.lowStockAlerts && stats.lowStockAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-red-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Alertas de Stock Bajo</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {stats.lowStockAlerts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{product.nombre}</p>
                        <p className="text-sm text-gray-600">
                          SKU: {product.sku} | {product.categoria} | {product.almacen}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">{product.stock}</p>
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

      {/* Tablas de productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de productos con más entradas del mes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📈 Productos con Más Entradas (Este Mes)
          </h2>
          {stats.topEntriesMonth && stats.topEntriesMonth.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-cyan-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Entradas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topEntriesMonth.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{item.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.sku}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">{item.total_entradas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No hay entradas este mes</p>
          )}
        </div>

        {/* Tabla de productos con menos salidas del mes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📉 Productos con Menos Salidas (Este Mes)
          </h2>
          {stats.lowExitsMonth && stats.lowExitsMonth.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-cyan-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Salidas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.lowExitsMonth.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{item.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.sku}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-yellow-600">{item.total_salidas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No hay datos de salidas</p>
          )}
        </div>
      </div>

      {/* Modal de reportes */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;