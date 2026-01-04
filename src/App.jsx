import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Movements from './pages/Movements';
import StockAlerts from './pages/StockAlerts';
import Categories from './pages/Categories';
import Warehouses from './pages/Warehouses';
import Users from './pages/Users';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Componente para redireccionar si ya está autenticado
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública - Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas con Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Redirección de / a /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard - Accesible para todos */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Productos - Accesible para todos */}
          <Route path="productos" element={<Products />} />

          {/* Movimientos - Accesible para todos */}
          <Route path="movimientos" element={<Movements />} />

          {/* Stock Alerts - Accesible para todos */}
          <Route path="stock" element={<StockAlerts />} />

          {/* Categorías - Solo administradores */}
          <Route
            path="categorias"
            element={
              <ProtectedRoute adminOnly>
                <Categories />
              </ProtectedRoute>
            }
          />

          {/* Almacenes - Solo administradores */}
          <Route
            path="almacenes"
            element={
              <ProtectedRoute adminOnly>
                <Warehouses />
              </ProtectedRoute>
            }
          />

          {/* Usuarios - Solo administradores */}
          <Route
            path="usuarios"
            element={
              <ProtectedRoute adminOnly>
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Ruta 404 - Redireccionar a dashboard o login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toaster 
          position="top-right"
          richColors
          closeButton
          expand={true}
          duration={3000}
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;