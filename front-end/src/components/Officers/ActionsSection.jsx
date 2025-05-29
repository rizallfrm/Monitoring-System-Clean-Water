import { DataTable } from './DataTable';

export function ActionsSection() {
  const columns = [
    { key: 'id', header: 'ID Tindakan', width: '229px' },
    { key: 'description', header: 'Deskripsi', width: '403px' },
    { key: 'date', header: 'Tanggal', width: '231px' },
    { key: 'status', header: 'Status', width: '241px' }
  ];

  const data = [
    {
      id: 'TDK-001',
      description: 'Perbaikan jalan berlubang',
      date: '2024-05-25',
      status: 'Menunggu'
    },
    {
      id: 'TDK-002',
      description: 'Penggantian lampu jalan',
      date: '2024-05-26',
      status: 'Menunggu'
    },
    {
      id: 'TDK-003',
      description: 'Pembersihan sampah',
      date: '2024-05-20',
      status: 'Selesai'
    }
  ];

  return (
    <section className="flex flex-col gap-4 w-[1104px] max-md:w-full">
      <h2 className="text-xl font-bold leading-5 text-gray-900 max-sm:text-lg">
        Riwayat Tindakan
      </h2>
      <DataTable
        columns={columns}
        data={data}
      />
    </section>
  );
}
export default ActionsSection;
