import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { warehouseService } from '../services/warehouseService';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProductModal from '../components/modals/ProductModal';
import ConfirmModal from '../components/modals/ConfirmModal';
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

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchData();
  }, [selectedWarehouse]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (selectedWarehouse) params.warehouse_id = selectedWarehouse;

      const [productsData, categoriesData, warehousesData] = await Promise.all([
        productService.getAll(params),
        categoryService.getAll(),
        warehouseService.getAll()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
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
      const data = await productService.getAll({ search: searchTerm });
      setProducts(data);
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

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await productService.delete(productToDelete.id);
      await fetchData();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct.id, data);
      } else {
        await productService.create(data);
      }
      
      setIsModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Error al guardar producto:', error);
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

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Productos</h1>

      <div className="flex flex-wrap gap-4 items-center">
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

        {isAdmin && (
          <Button className='w-full md:w-auto' variant="primary" icon={Plus} onClick={handleCreate}>
            Agregar producto
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={filteredProducts}
        onEdit={isAdmin ? handleEdit : null}
        onDelete={isAdmin ? handleDelete : null}
        loading={loading}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={selectedProduct}
        categories={categories}
        warehouses={warehouses}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar producto?"
        message={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Products;