import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import WarehouseModal from '../components/modals/WarehouseModal';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/warehouses');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error al cargar almacenes:', error);
      alert('Error al cargar los almacenes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const handleDelete = async (warehouse) => {
    if (!window.confirm(`¿Estás seguro de eliminar el almacén "${warehouse.nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/warehouses/${warehouse.id}`);
      alert('Almacén eliminado exitosamente');
      fetchWarehouses();
    } catch (error) {
      console.error('Error al eliminar almacén:', error);
      alert(error.response?.data?.message || 'Error al eliminar el almacén');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedWarehouse) {
        await api.put(`/warehouses/${selectedWarehouse.id}`, data);
        alert('Almacén actualizado exitosamente');
      } else {
        await api.post('/warehouses', data);
        alert('Almacén creado exitosamente');
      }
      setIsModalOpen(false);
      fetchWarehouses();
    } catch (error) {
      console.error('Error al guardar almacén:', error);
      alert(error.response?.data?.message || 'Error al guardar el almacén');
    }
  };

  const columns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { 
      header: 'Dirección', 
      render: (row) => row.ubicacion || 'Sin dirección'
    },
    {
      header: 'Descripción',
      render: () => 'Almacén de productos'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Almacenes</h1>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          Añadir almacén
        </Button>
      </div>

      {/* Tabla de almacenes */}
      <Table
        columns={columns}
        data={warehouses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal */}
      <WarehouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        warehouse={selectedWarehouse}
      />
    </div>
  );
};

export default Warehouses;