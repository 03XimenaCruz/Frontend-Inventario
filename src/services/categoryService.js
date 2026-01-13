import api from './api';
import { toast } from 'sonner';

export const categoryService = {
  getAll: async (params) => {
    try {
      const response = await api.get('/categories', {params});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/categories', data);
      toast.success('Categoría creada exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      toast.success('Categoría actualizada exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      toast.success('Categoría eliminada exitosamente');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar categoría';
      toast.error(errorMessage);
      throw error;
    }
  },
};
