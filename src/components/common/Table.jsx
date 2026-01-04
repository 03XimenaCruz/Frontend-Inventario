import { Edit, Trash2 } from 'lucide-react';

const Table = ({ columns, data, onEdit, onDelete, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div>
      {/* VISTA DE TABLA - Solo visible en pantallas grandes (lg y superiores) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-cyan-100 rounded">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Opciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-cyan-50 transition-colors">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center justify-center gap-3">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-cyan-600 hover:text-cyan-700 transition p-2 hover:bg-white rounded"
                          title="Editar"
                        >
                          <Edit size={18}/>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-red-600 hover:text-red-700 transition p-2 hover:bg-white rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={18}/>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VISTA DE CARDS - Visible en móvil y tablet (menores a lg) */}
      <div className="lg:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="bg-white hover:bg-cyan-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* Contenido de la card */}
            <div className="space-y-3">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start">
                  <span className="font-semibold text-gray-700 text-sm uppercase">
                    {column.header}:
                  </span>
                  <span className="text-gray-800 text-sm text-right ml-2">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </span>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-cyan-200">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded transition"
                  >
                    <Edit size={16}/>
                    <span className="text-sm font-medium">Editar</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
                  >
                    <Trash2 size={16}/>
                    <span className="text-sm font-medium">Eliminar</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;