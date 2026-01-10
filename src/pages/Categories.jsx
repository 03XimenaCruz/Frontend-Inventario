import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { warehouseService } from '../services/warehouseService';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import CategoryModal from '../components/modals/CategoryModal';
import ConfirmModal from '../components/modals/ConfirmModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');  // ✅ NUEVO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // ✅ Cargar almacenes al iniciar
  useEffect(() => {
    fetchWarehouses();
  }, []);

  // ✅ Cargar categorías cuando cambia el almacén seleccionado
  useEffect(() => {
    fetchCategories();
  }, [selectedWarehouse]);

  const fetchWarehouses = async () => {
    try {
      const warehousesData = await warehouseService.getAll();
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Error al cargar almacenes:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // ✅ Si hay almacén seleccionado, filtrar por ese almacén
      const params = {};
      if (selectedWarehouse) {
        params.warehouse_id = selectedWarehouse;
      }
      
      const categoriesData = await categoryService.getAll(params);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await categoryService.delete(categoryToDelete.id);
      await fetchCategories();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory.id, data);
      } else {
        await categoryService.create(data);
      }
      setIsModalOpen(false);
      await fetchCategories();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const columns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    {
      header: 'Almacén',
      render: (row) => row.almacen 
        ? <Badge type="almacen" text={row.almacen} />
        : <span className="text-gray-500 text-sm italic">Global (Todos)</span>
    },
    {
      header: 'Descripción',
      render: () => 'Categoría de productos'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:justify-end
  lg:justify-end  lg:w-auto">
          {/* ✅ Filtro de Almacén - Solo si hay más de 1 */}
          {warehouses.length > 1 && (
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary w-full sm:w-auto"
            >
              <option value="">Todos los almacenes</option>
              {warehouses.map(wh => (
                <option key={wh.id} value={wh.id}>{wh.nombre}</option>
              ))}
            </select>
          )}

          <Button 
            className='w-full sm:w-auto' 
            variant="primary" 
            icon={Plus} 
            onClick={handleCreate}
          >
            Añadir categoría
          </Button>
        </div>
      </div>
      
      {/* Tabla */}
      <Table
        columns={columns}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal de crear/editar */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
        warehouses={warehouses}
      />

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar categoría?"
        message={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Categories;