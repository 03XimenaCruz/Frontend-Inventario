import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import CategoryModal from '../components/modals/CategoryModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      alert('Error al cargar las categorías');
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

  const handleDelete = async (category) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${category.nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/categories/${category.id}`);
      alert('Categoría eliminada exitosamente');
      fetchCategories();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert(error.response?.data?.message || 'Error al eliminar la categoría');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory.id}`, data);
        alert('Categoría actualizada exitosamente');
      } else {
        await api.post('/categories', data);
        alert('Categoría creada exitosamente');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert(error.response?.data?.message || 'Error al guardar la categoría');
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          Añadir categoría
        </Button>
      </div>

      {/* Tabla de categorías */}
      <Table
        columns={columns}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
      />
    </div>
  );
};

export default Categories;