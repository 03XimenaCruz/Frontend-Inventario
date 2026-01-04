import api from './api';
import { toast } from 'sonner';

export const authService = {
  login: async (correo, contrasenia) => {
    try {
      const response = await api.post('/auth/login', { correo, contrasenia });
      toast.success('¡Bienvenido!');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};