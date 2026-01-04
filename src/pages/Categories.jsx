import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { categoryService } from '../services/categoryService';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import CategoryModal from '../components/modals/CategoryModal';
import ConfirmModal from '../components/modals/ConfirmModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
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
      header: 'Descripción',
      render: () => 'Categoría de productos'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
        <Button className='w-full md:w-auto md:ml-auto lg:ml-0' variant="primary" icon={Plus} onClick={handleCreate}>
          Añadir categoría
        </Button>
      </div>

      <Table
        columns={columns}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
      />

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