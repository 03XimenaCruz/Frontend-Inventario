import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

const ProductModal = ({ isOpen, onClose, onSubmit, product, categories, warehouses }) => {
  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    category_id: '',
    warehouse_id: '',
    stock_minimo: '',
    stock_maximo: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  // Determinar si mostrar el selector de almacén
  const showWarehouseSelector = warehouses && warehouses.length > 1;

  useEffect(() => {
    if (product) {
      // Modo edición
      setFormData({
        sku: product.sku || '',
        nombre: product.nombre || '',
        category_id: product.category_id || '',
        warehouse_id: product.warehouse_id || '',
        stock_minimo: product.stock_minimo || '',
        stock_maximo: product.stock_maximo || ''
      });
      setSelectedWarehouse(product.warehouse_id ? product.warehouse_id.toString() : '');
    } else {
      // Modo creación
      if (warehouses && warehouses.length === 1) {
        // Si solo hay 1 almacén, seleccionarlo automáticamente
        setFormData({
          sku: '',
          nombre: '',
          category_id: '',
          warehouse_id: warehouses[0].id,
          stock_minimo: '',
          stock_maximo: ''
        });
        setSelectedWarehouse(warehouses[0].id.toString());
      } else if (warehouses && warehouses.length > 1) {
        // Si hay múltiples almacenes, dejar vacío
        setFormData({
          sku: '',
          nombre: '',
          category_id: '',
          warehouse_id: '',
          stock_minimo: '',
          stock_maximo: ''
        });
        setSelectedWarehouse('');
      } else {
        // Si no hay almacenes
        setFormData({
          sku: '',
          nombre: '',
          category_id: '',
          warehouse_id: '',
          stock_minimo: '',
          stock_maximo: ''
        });
        setSelectedWarehouse('');
      }
    }
    setErrors({});
  }, [product, warehouses, isOpen]);

  // Filtrar categorías según el almacén seleccionado
  const filteredCategories = categories?.filter(category => {
    // Si no hay almacén seleccionado en el filtro, no mostrar categorías
    if (!selectedWarehouse) return false;
    
    // Mostrar categorías del almacén seleccionado O categorías globales (sin warehouse_id)
    return (
      category.warehouse_id === parseInt(selectedWarehouse) || 
      category.warehouse_id === null || 
      category.warehouse_id === undefined
    );
  }) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleWarehouseChange = (e) => {
    const warehouseId = e.target.value;
    setSelectedWarehouse(warehouseId);
    
    // Actualizar el formData con el warehouse_id
    setFormData(prev => ({
      ...prev,
      warehouse_id: warehouseId,
      category_id: '' // Resetear categoría al cambiar de almacén
    }));

    // Limpiar errores
    if (errors.warehouse_id) {
      setErrors(prev => ({ ...prev, warehouse_id: '' }));
    }
    if (errors.category_id) {
      setErrors(prev => ({ ...prev, category_id: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    
    // Validar almacén si hay almacenes registrados
    if (warehouses && warehouses.length > 0 && !formData.warehouse_id) {
      newErrors.warehouse_id = 'El almacén es requerido';
    }
    
    if (!formData.category_id) newErrors.category_id = 'La categoría es requerida';
    
    const stockMin = parseInt(formData.stock_minimo);
    const stockMax = parseInt(formData.stock_maximo);
    
    if (!formData.stock_minimo) {
      newErrors.stock_minimo = 'El stock mínimo es requerido';
    } else if (stockMin < 0) {
      newErrors.stock_minimo = 'El stock mínimo debe ser positivo';
    } else if (!Number.isInteger(stockMin)) {
      newErrors.stock_minimo = 'El stock mínimo debe ser un número entero';
    }
    
    if (!formData.stock_maximo) {
      newErrors.stock_maximo = 'El stock máximo es requerido';
    } else if (stockMax < 0) {
      newErrors.stock_maximo = 'El stock máximo debe ser positivo';
    } else if (!Number.isInteger(stockMax)) {
      newErrors.stock_maximo = 'El stock máximo debe ser un número entero';
    }
    
    if (stockMin && stockMax && stockMin > stockMax) {
      newErrors.stock_minimo = 'El stock mínimo no puede ser mayor al máximo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const dataToSubmit = {
      ...formData,
      stock_minimo: parseInt(formData.stock_minimo),
      stock_maximo: parseInt(formData.stock_maximo),
    };

    // Si no hay almacenes, eliminar warehouse_id
    if (!warehouses || warehouses.length === 0) {
      delete dataToSubmit.warehouse_id;
    }

    try {
      await onSubmit(dataToSubmit);
    } catch (error) {
      const message = error?.response?.data?.message;

      if (message && message.toLowerCase().includes('sku')) {
        setErrors(prev => ({
          ...prev,
          sku: message
        }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Editar Producto' : 'Agregar Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                errors.sku ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: SKU-001"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre del producto"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          {/* Almacén - PRIMERO (solo si hay más de 1 o en modo edición) */}
          {(showWarehouseSelector || product) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Almacén <span className="text-red-500">*</span>
              </label>
              {showWarehouseSelector ? (
                <select
                  name="warehouse_id"
                  value={selectedWarehouse}
                  onChange={handleWarehouseChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.warehouse_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar almacén</option>
                  {warehouses.map(wh => (
                    <option key={wh.id} value={wh.id}>{wh.nombre}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={warehouses?.[0]?.nombre || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              )}
              {errors.warehouse_id && <p className="text-red-500 text-sm mt-1">{errors.warehouse_id}</p>}
            </div>
          )}

          {/* Categoría - SEGUNDO (filtrada por almacén) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                errors.category_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={showWarehouseSelector && !selectedWarehouse}
            >
              <option value="">
                {showWarehouseSelector && !selectedWarehouse 
                  ? 'Primero selecciona un almacén' 
                  : 'Seleccionar categoría'
                }
              </option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre} {cat.warehouse_id ? `(${cat.almacen})` : '(Global)'}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
            {showWarehouseSelector && selectedWarehouse && filteredCategories.length === 0 && (
              <p className="text-amber-600 text-sm mt-1">
                No hay categorías disponibles para este almacén
              </p>
            )}
          </div>

          {/* Stock mínimo y máximo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock_minimo"
                value={formData.stock_minimo}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                  errors.stock_minimo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="1"
              />
              {errors.stock_minimo && <p className="text-red-500 text-sm mt-1">{errors.stock_minimo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Maximo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock_maximo"
                value={formData.stock_maximo}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                  errors.stock_maximo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="1"
              />
              {errors.stock_maximo && <p className="text-red-500 text-sm mt-1">{errors.stock_maximo}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {product ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;