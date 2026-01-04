import api from './api';
import { toast } from 'sonner';

export const warehouseService = {
  getAll: async () => {
    try {
      const response = await api.get('/warehouses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/warehouses', data);
      toast.success('Almacén creado exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/warehouses/${id}`, data);
      toast.success('Almacén actualizado exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/warehouses/${id}`);
      toast.success('Almacén eliminado exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
