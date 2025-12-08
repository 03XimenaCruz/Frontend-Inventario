import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

const MovementModal = ({ isOpen, onClose, onSubmit, products }) => {
  const [formData, setFormData] = useState({
    tipo_movimiento: 'entrada',
    product_id: '',
    cantidad: '',
    nota: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia el producto, buscar información del producto
    if (name === 'product_id') {
      const product = products?.find(p => p.id === parseInt(value));
      setSelectedProduct(product || null);
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Registrar Movimiento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          {/* Producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto <span className="text-red-500">*</span>
            </label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                errors.product_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar producto</option>
              {products?.map(prod => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} - {prod.sku} (Stock: {prod.stock})
                </option>
              ))}
            </select>
            {errors.product_id && <p className="text-red-500 text-sm mt-1">{errors.product_id}</p>}
          </div>

          {/* Información del producto seleccionado */}
          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:border-primary"
              placeholder="Observaciones sobre el movimiento..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Registrar Movimiento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementModal;