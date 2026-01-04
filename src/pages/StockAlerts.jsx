import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, Package, Search } from 'lucide-react';
import { productService } from '../services/productService';
import { warehouseService } from '../services/warehouseService';
import api from '../services/api';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

const StockAlerts = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    bajo: 0,
    medio: 0,
    suficiente: 0,
    total: 0
  });

  useEffect(() => {
    fetchData();
  }, [selectedWarehouse]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {};
      if (selectedWarehouse) params.warehouse_id = selectedWarehouse;

      const [productsData, warehousesData] = await Promise.all([
        productService.getAll(params),
        warehouseService.getAll()
      ]);

      setProducts(productsData);
      setWarehouses(warehousesData);

      const bajo = productsData.filter(p => p.stock <= p.stock_minimo).length;
      const suficiente = productsData.filter(p => p.stock >= p.stock_maximo).length;
      const medio = productsData.length - bajo - suficiente;

      setStats({
        bajo,
        medio,
        suficiente,
        total: productsData.length
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (product) => {
    if (product.stock <= product.stock_minimo) return 'bajo';
    if (product.stock >= product.stock_maximo) return 'suficiente';
    return 'medio';
  };

  const columns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Categoría', accessor: 'categoria' },
    {
      header: 'Almacén',
      render: (row) => <Badge type="almacen" text={row.almacen} />
    },
    {
      header: 'Stock',
      render: (row) => (
        <span className={`font-semibold ${
          getStatus(row) === 'bajo' ? 'text-red-600' :
          getStatus(row) === 'medio' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {row.stock}
        </span>
      )
    },
    { header: 'Stock mínimo', accessor: 'stock_minimo' },
    {
      header: 'Status',
      render: (row) => <Badge type={getStatus(row)} />
    }
  ];

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Alertas de stock</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">Stock bajo</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{stats.bajo}</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">Stock medio</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.medio}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp size={28} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">Stock suficiente</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats.suficiente}</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={28} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-cyan-50 border-l-4 border-cyan-400 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">Total de productos</p>
              <p className="text-4xl font-bold text-cyan-600 mt-2">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center">
              <Package size={28} className="text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {warehouses.length > 1 && (
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary w-full md:w-auto"
          >
            <option value="">Todos los almacenes</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>{wh.nombre}</option>
            ))}
          </select>
        )}
      </div>

      <Table
        columns={columns}
        data={filteredProducts}
        loading={loading}
      />
    </div>
  );
};

export default StockAlerts;
