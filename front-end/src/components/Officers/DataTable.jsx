import { useEffect, useState } from 'react';
import actionService from '../../services/actionService';
import reportService from '../../services/reportService';
import statusService from '../../services/statusService';
import userService from '../../services/userService';

export function DataTable({ columns, data: initialData, actions, dataType, refreshTrigger }) {
  const [data, setData] = useState(initialData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data berdasarkan tipe
  const fetchData = async () => {
    try {
      setLoading(true);
      let response;
      
      switch(dataType) {
        case 'actions':
          response = await actionService.getAllActions();
          break;
        case 'reports':
          response = await reportService.getAllReports();
          break;
        case 'status':
          response = await statusService.getAllStatusUpdates();
          break;
        case 'users':
          response = await userService.getAllUsers();
          break;
        default:
          // Jika tidak ada dataType, gunakan data awal
          setData(initialData);
          return;
      }
      
      setData(response.data || response);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efek untuk mengambil data saat komponen mount atau refreshTrigger berubah
  useEffect(() => {
    if (dataType) {
      fetchData();
    } else {
      setData(initialData);
    }
  }, [dataType, refreshTrigger, initialData]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="flex justify-center items-center bg-white rounded-xl shadow w-[1104px] max-md:overflow-x-auto max-md:w-full">
      <table className="border-collapse w-[1104px] max-md:min-w-[800px]">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-5 pt-3.5 pb-3.5 text-sm font-semibold text-left text-gray-800"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`p-5 text-sm text-gray-800 ${
                    rowIndex === 0 ? '' : 'border-t border-solid border-t-gray-100'
                  }`}
                >
                  {column.key === 'actions' && actions
                    ? actions(row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;