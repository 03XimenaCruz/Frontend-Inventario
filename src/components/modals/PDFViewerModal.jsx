import { X, Download } from 'lucide-react';
import { useEffect } from 'react';
import Button from '../common/Button';

const PDFViewerModal = ({ isOpen, onClose, pdfUrl, filename }) => {
  // Limpiar blob URL cuando se cierre el modal
  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Vista Previa del Reporte</h2>
          <div className="flex gap-2">
            <Button
              variant="primary"
              icon={Download}
              onClick={handleDownload}
              className="text-sm"
            >
              Descargar PDF
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden p-4">
          <iframe
            src={pdfUrl}
            className="w-full h-full border rounded-lg"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal;