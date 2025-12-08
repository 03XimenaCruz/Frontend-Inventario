import { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';
import Button from '../common/Button';
import api from '../../services/api';

const ReportModal = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState('inventory');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [format, setFormat] = useState('csv'); // 'csv' o 'pdf'
  const [loading, setLoading] = useState(false);

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(',')
    ).join('\n');

    const csv = `\ufeff${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = async (url, filename) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al descargar PDF');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      throw error;
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);

    try {
      let endpoint;
      let filename;
      let params = { format };

      switch (reportType) {
        case 'inventory':
          endpoint = '/dashboard/inventory-report-month';
          params = { ...params, year: selectedYear, month: selectedMonth };
          filename = format === 'pdf' 
            ? `inventario_${selectedYear}_${selectedMonth}.pdf`
            : `inventario_${selectedYear}_${selectedMonth}.csv`;
          break;

        case 'lowStock':
          endpoint = '/dashboard/low-stock-report';
          filename = format === 'pdf'
            ? `stock_bajo_${new Date().toISOString().split('T')[0]}.pdf`
            : `stock_bajo_${new Date().toISOString().split('T')[0]}.csv`;
          break;

        case 'movements':
          endpoint = '/dashboard/movements-report-month';
          params = { ...params, year: selectedYear, month: selectedMonth };
          filename = format === 'pdf'
            ? `movimientos_${selectedYear}_${selectedMonth}.pdf`
            : `movimientos_${selectedYear}_${selectedMonth}.csv`;
          break;

        default:
          throw new Error('Tipo de reporte no válido');
      }

      if (format === 'pdf') {
        // Descargar PDF
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const queryString = new URLSearchParams(params).toString();
        const url = `${apiUrl}${endpoint}?${queryString}`;
        await downloadPDF(url, filename);
      } else {
        // Descargar CSV
        const response = await api.get(endpoint, { params });
        downloadCSV(response.data, filename);
      }

      alert('Reporte generado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert(error.response?.data?.message || 'Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <FileText size={24} className="text-cyan-400" />
            <h2 className="text-2xl font-bold text-gray-800">Generar Reporte</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Tipo de reporte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Reporte
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="reportType"
                  value="inventory"
                  checked={reportType === 'inventory'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium text-gray-800">Inventario Completo</p>
                  <p className="text-sm text-gray-600">Todos los productos activos del mes seleccionado</p>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="reportType"
                  value="lowStock"
                  checked={reportType === 'lowStock'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium text-gray-800">Productos con Stock Bajo</p>
                  <p className="text-sm text-gray-600">Solo productos con stock crítico o bajo</p>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="reportType"
                  value="movements"
                  checked={reportType === 'movements'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium text-gray-800">Movimientos del Mes</p>
                  <p className="text-sm text-gray-600">Todas las entradas y salidas con usuario responsable</p>
                </div>
              </label>
            </div>
          </div>

          {/* Formato de descarga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Formato de Descarga
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mr-2"
                />
                <span className="font-medium">CSV</span>
              </label>

              <label className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mr-2"
                />
                <span className="font-medium">PDF</span>
              </label>
            </div>
          </div>

          {/* Filtros de fecha (solo para inventory y movements) */}
          {(reportType === 'inventory' || reportType === 'movements') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              icon={Download}
              onClick={handleGenerateReport}
              disabled={loading}
              className="flex-1 justify-center"
            >
              {loading ? 'Generando...' : `Generar ${format.toUpperCase()}`}
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1 justify-center"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;