import { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import actionService from '../../services/actionService';
import reportService from '../../services/reportService'; // For potential report data integration

export function ActionsSection({ refreshTrigger }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    { key: 'id', header: 'ID Tindakan', width: '229px' },
    { key: 'description', header: 'Deskripsi', width: '403px' },
    { key: 'date', header: 'Tanggal', width: '231px' },
    { key: 'status', header: 'Status', width: '241px' },
    { 
      key: 'actions', 
      header: 'Aksi', 
      width: '150px',
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row.id)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-900"
          >
            Hapus
          </button>
        </div>
      )
    }
  ];

  const fetchActions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      // Using actionService with pagination
      const response = await actionService.getAllActions(params);
      
      // Format the data
      const formattedActions = response.data.map(action => ({
        id: action.id || action._id,
        description: action.description || 'Tidak ada deskripsi',
        date: formatDate(action.date || action.createdAt),
        status: getStatusLabel(action.status),
        originalData: action // Keep original data for reference
      }));

      setData(formattedActions);
      setPagination(prev => ({
        ...prev,
        total: response.total || response.data.length
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal mengambil data tindakan');
      console.error('Error fetching actions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Menunggu',
      in_progress: 'Dalam Proses',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    };
    return statusMap[status] || status;
  };

  const handleEdit = async (id) => {
    try {
      // Get single action detail
      const action = await actionService.getActionById(id);
      // Handle edit logic here
      console.log('Editing action:', action);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal mengambil detail tindakan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tindakan ini?')) return;
    
    try {
      await actionService.deleteAction(id);
      // Refresh data after deletion
      fetchActions();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menghapus tindakan');
    }
  };

  useEffect(() => {
    fetchActions();
  }, [pagination.page, pagination.limit, refreshTrigger]);

  return (
    <section className="flex flex-col gap-4 w-[1104px] max-md:w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold leading-5 text-gray-900 max-sm:text-lg">
          Riwayat Tindakan
        </h2>
        <button 
          onClick={() => fetchActions()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Refresh Data
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p>Memuat data tindakan...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-red-800 hover:text-red-900"
          >
            Tutup
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <DataTable
            columns={columns}
            data={data}
          />
          
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-sm text-gray-700">
                Menampilkan {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default ActionsSection;