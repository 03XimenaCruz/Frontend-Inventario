import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../services/userService';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import UserModal from '../components/modals/UserModal';
import ConfirmModal from '../components/modals/ConfirmModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
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

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  // 4. Agregar confirmDelete
  const confirmDelete = async () => {
    try {
      await userService.delete(userToDelete.id);
      await fetchUsers();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedUser) {
        await userService.update(selectedUser.id, data);
      } else {
        await userService.create(data);
      }
      setIsModalOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
        <Button className='w-full md:w-auto md:ml-auto lg:ml-0' variant="primary" icon={Plus} onClick={handleCreate}>
          Añadir usuario
        </Button>
      </div>

      <Table
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar usuario?"
        message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Users;