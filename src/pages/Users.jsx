import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import UserModal from '../components/modals/UserModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario "${user.nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/users/${user.id}`);
      alert('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(error.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, data);
        alert('Usuario actualizado exitosamente');
      } else {
        await api.post('/users', data);
        alert('Usuario creado exitosamente');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(error.response?.data?.message || 'Error al guardar el usuario');
    }
  };

  const columns = [
    { header: 'Id/Usuario', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Correo', accessor: 'correo' },
    {
      header: 'Contraseña',
      render: () => '••••••••'
    },
    {
      header: 'Rol',
      render: (row) => <Badge type={row.rol} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          Añadir usuario
        </Button>
      </div>

      {/* Tabla de usuarios */}
      <Table
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;