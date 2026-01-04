import api from './api';
import { toast } from 'sonner';

export const movementService = {
  getAll: async (params) => {
    try {
      const response = await api.get('/movements', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/movements', data);
      toast.success('Movimiento registrado exitosamente');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/movements/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
