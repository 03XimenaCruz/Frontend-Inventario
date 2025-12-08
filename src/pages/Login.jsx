import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.correo, formData.contrasenia);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo/Icono */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center">
            <Package size={40} className="text-white" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Sistema de Inventario
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Inicia sesión para continuar
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              placeholder="tu@correo.com"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Botón de submit */}
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            icon={LogIn}
            className="w-full justify-center py-3 text-lg"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Información adicional */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>¿No tienes cuenta? Contacta al administrador</p>
        </div>
      </div>
    </div>
  );
};

export default Login;