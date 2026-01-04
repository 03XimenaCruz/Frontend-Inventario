import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { warehouseService } from '../services/warehouseService';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import WarehouseModal from '../components/modals/WarehouseModal';
import ConfirmModal from '../components/modals/ConfirmModal';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await warehouseService.getAll();
      setWarehouses(data);
    } catch (error) {
      console.error('Error al cargar almacenes:', error);
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

  const handleDelete = (warehouse) => {
    setWarehouseToDelete(warehouse);
    setIsConfirmModalOpen(true);
  };

  // ✅ 4. Agregar confirmDelete
  const confirmDelete = async () => {
    try {
      await warehouseService.delete(warehouseToDelete.id);
      await fetchWarehouses();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedWarehouse) {
        await warehouseService.update(selectedWarehouse.id, data);
      } else {
        await warehouseService.create(data);
      }
      setIsModalOpen(false);
      await fetchWarehouses();
    } catch (error) {
      console.error('Error al guardar almacén:', error);
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Almacenes</h1>
        <Button className='w-full md:w-auto md:ml-auto lg:ml-0' variant="primary" icon={Plus} onClick={handleCreate}>
          Añadir almacén
        </Button>
      </div>

      <Table
        columns={columns}
        data={warehouses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <WarehouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        warehouse={selectedWarehouse}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar almacén?"
        message={`¿Estás seguro de que deseas eliminar el almacén "${warehouseToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Warehouses;