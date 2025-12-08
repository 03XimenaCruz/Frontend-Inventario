import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import MovementModal from '../components/modals/MovementModal';

const Movements = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedWarehouse]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {};
      if (selectedWarehouse) params.warehouse_id = selectedWarehouse;

      const [movementsRes, productsRes, warehousesRes] = await Promise.all([
        api.get('/movements', { params }),
        api.get('/products'),
        api.get('/warehouses')
      ]);

      setMovements(movementsRes.data);
      setProducts(productsRes.data);
      setWarehouses(warehousesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      await api.post('/movements', data);
      alert('Movimiento registrado exitosamente');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      alert(error.response?.data?.message || 'Error al registrar el movimiento');
    }
  };

  const columns = [
    { header: 'Id', accessor: 'id' },
    {
      header: 'Tipo',
      render: (row) => <Badge type={row.tipo_movimiento} text={row.tipo_movimiento} />
    },
    { header: 'Producto', accessor: 'producto' },
    {
      header: 'Almacén',
      render: (row) => <Badge type="almacen" text={row.almacen} />
    },
    { header: 'Cantidad', accessor: 'cantidad' },
    { header: 'Stock Ant.', accessor: 'stock_anterior' },
    {
      header: 'Stock Act.',
      render: (row) => (
        <span className="font-medium text-cyan-600">{row.stock_actual}</span>
      )
    },
    { header: 'Usuario', accessor: 'usuario' },
    {
      header: 'Fecha',
      render: (row) => {
        const date = new Date(row.created_at);
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString('es-MX')}</div>
            <div className="text-gray-500">{date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Registro de entradas y salidas de productos</h1>

      {/* Barra de filtros */}
      <div className="flex justify-end flex-wrap gap-4 items-center">
        {/* Filtro por almacén (solo si hay más de 1 almacén) */}
        {warehouses.length > 1 && (
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="">Todos los almacenes</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>{wh.nombre}</option>
            ))}
          </select>
        )}

        {/* Botón registrar movimiento */}
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          Registrar movimiento
        </Button>
      </div>

      {/* Tabla de movimientos */}
      <Table
        columns={columns}
        data={movements}
        loading={loading}
      />

      {/* Modal */}
      <MovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        products={products}
      />
    </div>
  );
};

export default Movements;