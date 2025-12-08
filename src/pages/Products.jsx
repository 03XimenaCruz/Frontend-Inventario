import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProductModal from '../components/modals/ProductModal';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchData();
  }, [selectedWarehouse]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Construir query params
      const params = {};
      if (selectedWarehouse) params.warehouse_id = selectedWarehouse;

      const [productsRes, categoriesRes, warehousesRes] = await Promise.all([
        api.get('/products', { params }),
        api.get('/categories'),
        api.get('/warehouses')
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setWarehouses(warehousesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchData();
      return;
    }

    try {
      const response = await api.get('/products', {
        params: { search: searchTerm }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${product.nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/products/${product.id}`);
      alert('Producto eliminado exitosamente');
      fetchData();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert(error.response?.data?.message || 'Error al eliminar el producto');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, data);
        alert('Producto actualizado exitosamente');
      } else {
        await api.post('/products', data);
        alert('Producto creado exitosamente');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert(error.response?.data?.message || 'Error al guardar el producto');
    }
  };

  const columns = [
    { header: 'SKU', accessor: 'sku' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Categoría', accessor: 'categoria' },
    {
      header: 'Almacén',
      render: (row) => <Badge type="almacen" text={row.almacen} />
    },
    { header: 'Stock', accessor: 'stock' },
    {
      header: 'Fecha de registro',
      render: (row) => new Date(row.created_at).toLocaleDateString('es-MX')
    }
  ];

  // Filtrar por búsqueda local
  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Productos</h1>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Búsqueda */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

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

        {/* Botón agregar (solo admin) */}
        {isAdmin && (
          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            Agregar producto
          </Button>
        )}
      </div>

      {/* Tabla de productos */}
      <Table
        columns={columns}
        data={filteredProducts}
        onEdit={isAdmin ? handleEdit : null}
        onDelete={isAdmin ? handleDelete : null}
        loading={loading}
      />

      {/* Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={selectedProduct}
        categories={categories}
        warehouses={warehouses}
      />
    </div>
  );
};

export default Products;