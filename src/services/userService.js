import api from './api';
import { toast } from 'sonner';

export const userService = {
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/users', data);
      toast.success('Usuario creado exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      toast.success('Usuario actualizado exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      toast.success('Usuario eliminado exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
