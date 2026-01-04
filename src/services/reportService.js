import api from './api';
import { toast } from 'sonner';

export const reportService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/reports/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getInventoryReport: async (year, month, format = 'json') => {
    try {
      const params = { year, month, format };
      
      if (format === 'pdf') {
        const response = await api.get('/reports/inventory', { 
          params,
          responseType: 'blob'
        });
        
        // Descargar PDF
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Reporte_Inventario_${year}_${month}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success('Reporte generado exitosamente');
        return response.data;
      }
      
      const response = await api.get('/reports/inventory', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLowStockReport: async (format = 'json') => {
    try {
      if (format === 'pdf') {
        const response = await api.get('/reports/low-stock', { 
          params: { format },
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Reporte_Stock_Bajo.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success('Reporte generado exitosamente');
        return response.data;
      }
      
      const response = await api.get('/reports/low-stock', { params: { format } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMovementsReport: async (year, month, format = 'json') => {
    try {
      const params = { year, month, format };
      
      if (format === 'pdf') {
        const response = await api.get('/reports/movements', { 
          params,
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Reporte_Movimientos_${year}_${month}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success('Reporte generado exitosamente');
        return response.data;
      }
      
      const response = await api.get('/reports/movements', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
