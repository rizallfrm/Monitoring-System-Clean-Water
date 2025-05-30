import { useEffect, useState } from 'react';
import { DataTable } from './DataTable';

export function ActionsSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'id', header: 'ID Tindakan', width: '229px' },
    { key: 'description', header: 'Deskripsi', width: '403px' },
    { key: 'date', header: 'Tanggal', width: '231px' },
    { key: 'status', header: 'Status', width: '241px' }
  ];

  useEffect(() => {
    const fetchActions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/actions');
        if (!response.ok) {
          throw new Error('Gagal mengambil data tindakan');
        }
        const actions = await response.json();

        // Pastikan data sesuai struktur kolom
        // Jika properti tanggal di response berbeda, sesuaikan di sini
        // Misal: response menggunakan 'createdAt' atau 'dateCreated' sebagai tanggal
        const formattedActions = actions.map(action => ({
          id: action.id || action._id || '',
          description: action.description || '',
          date: action.date || action.createdAt?.slice(0,10) || '',
          status: action.status || ''
        }));

        setData(formattedActions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  return (
    <section className="flex flex-col gap-4 w-[1104px] max-md:w-full">
      <h2 className="text-xl font-bold leading-5 text-gray-900 max-sm:text-lg">
        Riwayat Tindakan
      </h2>

      {loading && <p>Loading data tindakan...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <DataTable
          columns={columns}
          data={data}
        />
      )}
    </section>
  );
}

export default ActionsSection;
