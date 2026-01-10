import { useState, useEffect } from 'react';
import { X, FileText, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Button from '../common/Button';
import PDFViewerModal from './PDFViewerModal';
import api from '../../services/api';

const ReportModal = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState('inventory');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [format, setFormat] = useState('csv');
  const [loading, setLoading] = useState(false);
  
  // Estados para datos
  const [warehouses, setWarehouses] = useState([]);
  const [firstRecordDate, setFirstRecordDate] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  
  // Estados para vista previa de PDF
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFilename, setPdfFilename] = useState('');

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

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      // Cargar almacenes
      const warehousesRes = await api.get('/dashboard/warehouses');
      setWarehouses(warehousesRes.data);

      // Cargar fecha del primer registro
      const dateRes = await api.get('/dashboard/first-record-date');
      setFirstRecordDate(dateRes.data);
      
      // Calcular años disponibles desde el primer registro hasta ahora
      const firstYear = dateRes.data.year;
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = currentYear; year >= firstYear; year--) {
        years.push(year);
      }
      setAvailableYears(years);
      
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      toast.error('Error al cargar datos iniciales');
    }
  };

  // Filtrar meses disponibles según el año seleccionado
  const getAvailableMonths = () => {
    if (!firstRecordDate) return months;

    const firstYear = firstRecordDate.year;
    const firstMonth = firstRecordDate.month;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return months.filter(month => {
      // Si el año seleccionado es el año inicial
      if (selectedYear === firstYear) {
        return month.value >= firstMonth;
      }
      // Si el año seleccionado es el año actual
      if (selectedYear === currentYear) {
        return month.value <= currentMonth;
      }
      // Para años intermedios, todos los meses están disponibles
      return true;
    });
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No hay datos para exportar');
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

  const handleGenerateReport = async (action = 'download') => {
    setLoading(true);

    try {
      let endpoint;
      let filename;
      let params = { format: action === 'preview' ? 'pdf' : format };

      // Agregar warehouse_id si no es "all"
      if (selectedWarehouse !== 'all') {
        params.warehouse_id = selectedWarehouse;
      }

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

      if (action === 'preview' || format === 'pdf') {
        // Generar URL para PDF
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const queryString = new URLSearchParams(params).toString();
        const url = `${apiUrl}${endpoint}?${queryString}`;
        
        // Hacer fetch con autenticación
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al generar PDF');
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        if (action === 'preview') {
          // Abrir vista previa con blob URL
          setPdfUrl(blobUrl);
          setPdfFilename(filename);
          setIsPDFViewerOpen(true);
          toast.success('Vista previa');
        } else {
          // Descargar directamente
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          
          toast.success('Reporte descargado exitosamente');
          onClose();
        }
      } else {
        // Descargar CSV
        const response = await api.get(endpoint, { params });
        downloadCSV(response.data, filename);
        toast.success('Reporte CSV descargado exitosamente');
        onClose();
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      toast.error(error.response?.data?.message || error.message || 'Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const showWarehouseFilter = warehouses.length > 1;
  const availableMonths = getAvailableMonths();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
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
                    <p className="text-sm text-gray-600">Todas las entradas y salidas realizadas con usuario responsable</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Filtro de Almacén (solo si hay más de 1) */}
            {showWarehouseFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Almacén
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="all">Todos los almacenes</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

            {/* Filtros de fecha (solo para inventario y movimientos) */}
            {(reportType === 'inventory' || reportType === 'movements') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    {availableYears.map(year => (
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    {availableMonths.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              {format === 'pdf' ? (
                <>
                  <Button
                    variant="primary"
                    icon={Eye}
                    onClick={() => handleGenerateReport('preview')}
                    disabled={loading}
                    className="flex-1 justify-center"
                  >
                    {loading ? 'Generando...' : 'Ver PDF'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 justify-center"
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    icon={Download}
                    onClick={() => handleGenerateReport('download')}
                    disabled={loading}
                    className="flex-1 justify-center"
                  >
                    {loading ? 'Generando...' : 'Descargar CSV'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 justify-center"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vista previa de PDF */}
      <PDFViewerModal
        isOpen={isPDFViewerOpen}
        onClose={() => {
          setIsPDFViewerOpen(false);
          setPdfUrl(null);
        }}
        pdfUrl={pdfUrl}
        filename={pdfFilename}
      />
    </>
  );
};

export default ReportModal;