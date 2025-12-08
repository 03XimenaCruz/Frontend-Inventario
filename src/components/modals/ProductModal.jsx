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

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        nombre: product.nombre || '',
        category_id: product.category_id || '',
        warehouse_id: product.warehouse_id || '',
        stock_minimo: product.stock_minimo || '',
        stock_maximo: product.stock_maximo || ''
      });
    } else {
      // Si no hay almacenes, dejar warehouse_id vacío
      // Si hay almacenes, seleccionar el primero por defecto
      const defaultWarehouse = warehouses && warehouses.length > 0 ? warehouses[0].id : '';
      
      setFormData({
        sku: '',
        nombre: '',
        category_id: '',
        warehouse_id: defaultWarehouse,
        stock_minimo: '',
        stock_maximo: ''
      });
    }
    setErrors({});
  }, [product, warehouses, isOpen]);

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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.category_id) newErrors.category_id = 'La categoría es requerida';
    
    // Solo validar warehouse_id si hay almacenes registrados
    if (warehouses && warehouses.length > 0 && !formData.warehouse_id) {
      newErrors.warehouse_id = 'El almacén es requerido';
    }
    
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        stock_minimo: parseInt(formData.stock_minimo),
        stock_maximo: parseInt(formData.stock_maximo)
      };
      
      // Si no hay almacenes, no enviar warehouse_id
      if (!warehouses || warehouses.length === 0) {
        delete dataToSubmit.warehouse_id;
      }
      
      onSubmit(dataToSubmit);
    }
  };

  if (!isOpen) return null;

  // Verificar si hay almacenes registrados
  const hasWarehouses = warehouses && warehouses.length > 0;

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

          {/* Categoría */}
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
            >
              <option value="">Seleccionar categoría</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
          </div>

          {/* Almacén (solo si hay almacenes registrados) */}
          {hasWarehouses && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Almacén <span className="text-red-500">*</span>
              </label>
              <select
                name="warehouse_id"
                value={formData.warehouse_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                  errors.warehouse_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar almacén</option>
                {warehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>{wh.nombre}</option>
                ))}
              </select>
              {errors.warehouse_id && <p className="text-red-500 text-sm mt-1">{errors.warehouse_id}</p>}
            </div>
          )}

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
                Stock Medio <span className="text-red-500">*</span>
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