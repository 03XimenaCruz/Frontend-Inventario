import { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';
import Button from '../common/Button';

const MovementModal = ({ isOpen, onClose, onSubmit, products, warehouses }) => {
  const [formData, setFormData] = useState({
    tipo_movimiento: 'entrada',
    product_id: '',
    cantidad: '',
    nota: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  
  // Estados para el autocompletado de productos
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Determinar si mostrar el filtro de almacén
  const showWarehouseFilter = warehouses && warehouses.length > 1;

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        tipo_movimiento: 'entrada',
        product_id: '',
        cantidad: '',
        nota: ''
      });
      setErrors({});
      setSelectedProduct(null);
      setSearchTerm('');
      setShowDropdown(false);
      
      // Si solo hay un almacén, seleccionarlo automáticamente
      if (warehouses && warehouses.length === 1) {
        setSelectedWarehouse(warehouses[0].id.toString());
      } else {
        setSelectedWarehouse('');
      }
    }
  }, [isOpen, warehouses]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar productos según el almacén seleccionado
  const filteredProducts = products?.filter(product => {
    // Si no hay almacén seleccionado, mostrar todos
    if (!selectedWarehouse) return true;
    // Filtrar por almacén
    return product.warehouse_id === parseInt(selectedWarehouse);
  }) || [];

  // Filtrar productos según el término de búsqueda
  const searchedProducts = filteredProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.nombre.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower)
    );
  });

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
    setSelectedWarehouse(e.target.value);
    // Resetear producto seleccionado al cambiar de almacén
    setFormData(prev => ({ ...prev, product_id: '' }));
    setSelectedProduct(null);
    setSearchTerm('');
  };

  const handleProductSelect = (product) => {
    setFormData(prev => ({
      ...prev,
      product_id: product.id
    }));
    setSelectedProduct(product);
    setSearchTerm(`${product.nombre} - ${product.sku}`);
    setShowDropdown(false);
    
    // Limpiar error si existía
    if (errors.product_id) {
      setErrors(prev => ({ ...prev, product_id: '' }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    
    // Si borra el texto, limpiar selección
    if (!e.target.value) {
      setFormData(prev => ({ ...prev, product_id: '' }));
      setSelectedProduct(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.product_id) newErrors.product_id = 'Selecciona un producto';
    
    const cantidad = parseInt(formData.cantidad);
    
    if (!formData.cantidad) {
      newErrors.cantidad = 'La cantidad es requerida';
    } else if (cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    } else if (!Number.isInteger(cantidad)) {
      newErrors.cantidad = 'La cantidad debe ser un número entero';
    }
    
    // Validar stock disponible para salidas
    if (formData.tipo_movimiento === 'salida' && selectedProduct) {
      if (cantidad > selectedProduct.stock) {
        newErrors.cantidad = `Stock insuficiente. Disponible: ${selectedProduct.stock}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        cantidad: parseInt(formData.cantidad)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Registrar Movimiento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Tipo de Movimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Movimiento <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo_movimiento"
              value={formData.tipo_movimiento}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>

          {/* Filtro de Almacén - Solo si hay más de 1 */}
          {showWarehouseFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Almacén <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedWarehouse}
                onChange={handleWarehouseChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Todos los almacenes</option>
                {warehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>{wh.nombre}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Selecciona un almacén para filtrar los productos
              </p>
            </div>
          )}

          {/* Producto con Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Buscar producto por nombre o SKU..."
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.product_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ChevronDown 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
                  size={18}
                  onClick={() => setShowDropdown(!showDropdown)}
                />
              </div>
              
              {/* Dropdown de productos */}
              {showDropdown && searchedProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchedProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{product.nombre}</div>
                      <div className="text-sm text-gray-600">
                        SKU: {product.sku} | Stock: {product.stock} | {product.almacen}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showDropdown && searchTerm && searchedProducts.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                  No se encontraron productos
                </div>
              )}
            </div>
            {errors.product_id && <p className="text-red-500 text-sm mt-1">{errors.product_id}</p>}
          </div>

          {/* Información del producto seleccionado */}
          {selectedProduct && (
            <div className="bg-blue-50 border border-primary rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Stock actual:</span> {selectedProduct.stock} unidades
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Almacén:</span> {selectedProduct.almacen}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Categoría:</span> {selectedProduct.categoria}
              </p>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                errors.cantidad ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
              min="1"
              step="1"
            />
            {errors.cantidad && <p className="text-red-500 text-sm mt-1">{errors.cantidad}</p>}
          </div>

          {/* Nota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nota (Opcional)
            </label>
            <textarea
              name="nota"
              value={formData.nota}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:primary"
              placeholder="Observaciones sobre el movimiento..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="primary" className="flex-1">
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementModal;