import { useEffect, useState } from 'react';
import statusService from '../../services/statusService';

export default function MetricCard({ title, className }) {
  const [metric, setMetric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetricData = async () => {
      try {
        const response = await statusService.getStatusStatistics();
        
        let data;
        switch(title) {
          case 'Konsumsi Air':
            data = {
              value: '2,450 m³',
              subtitle: 'Bulan April 2025',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/612386b01a703bc3c493c2add36edb65791f6453'
            };
            break;
          case 'Kualitas Air':
            data = {
              value: response.data.qualityStatus || 'Normal',
              subtitle: `Update terakhir: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/aca8406948c8cb44df0b49aeec346e85d5d45fa7'
            };
            break;
          case 'Tekanan Air':
            data = {
              value: response.data.pressureStatus || '2.5 bar',
              subtitle: `Status: ${response.data.pressureNormal ? 'Normal' : 'Tidak Normal'}`,
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f09cdb3860beb18353391aa0eaab86d6c6faa24'
            };
            break;
          default:
            data = {
              value: 'N/A',
              subtitle: 'Data tidak tersedia',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f09cdb3860beb18353391aa0eaab86d6c6faa24'
            };
        }
        
        setMetric(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricData();
  }, [title]);

  if (loading) return <div className={`${className} p-6`}>Memuat data...</div>;
  if (error) return <div className={`${className} p-6 text-red-500`}>Error: {error}</div>;
if (!metric) return <div className={`${className} p-6`}>Data tidak tersedia.</div>;

  return (
    <article className={className}>
      <div className="p-6 mx-auto w-full bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5 max-md:mt-6">
        <div className="flex gap-5 justify-between py-0.5 w-full bg-black bg-opacity-0">
          <h3 className="text-base leading-none text-gray-600">{title}</h3>
          <div className="flex overflow-hidden justify-center items-center self-start mt-1 min-h-4">
            <img
              src={metric.icon}
              alt={`${title} icon`}
              className="object-contain self-stretch my-auto w-3 aspect-[0.75]"
            />
          </div>
        </div>
        <p className="z-10 pt-0 pb-3.5 mt-4 text-3xl font-bold text-gray-800 bg-black bg-opacity-0 max-md:pr-5">
          {metric.value}
        </p>
        <p className="pb-1.5 mt-2 text-sm text-gray-500 bg-black bg-opacity-0 max-md:pr-5">
          {metric.subtitle}
        </p>
      </div>
    </article>
  );
}