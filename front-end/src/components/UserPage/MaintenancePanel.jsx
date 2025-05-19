import { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

export default function MaintenancePanel() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceSchedules = async () => {
      try {
        const response = await reportService.getAllReports({
          type: 'maintenance',
          limit: 2,
          sort: 'scheduleDate:asc'
        });
        
        setSchedules(response.data.map(item => ({
          id: item._id,
          icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7b92397536980034318f675ea40fb4b11d5f4613',
          title: item.title,
          date: formatDate(item.scheduleDate || item.createdAt)
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceSchedules();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) return <div className="p-6">Memuat jadwal...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <article className="w-6/12 max-md:ml-0 max-md:w-full">
      <div className="grow p-6 w-full bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5 max-md:mt-6 max-md:max-w-full">
        <h2 className="pt-px pb-3 text-lg font-bold text-gray-800 bg-black bg-opacity-0 max-md:pr-5 max-md:max-w-full">
          Jadwal Maintenance
        </h2>
        <div className="mt-4 w-full bg-black bg-opacity-0 max-md:max-w-full">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex flex-wrap gap-5 justify-between w-full bg-black bg-opacity-0 max-md:max-w-full mt-3 first:mt-0"
            >
              <div className="flex gap-3 py-0.5 bg-black bg-opacity-0">
                <div className="flex overflow-hidden justify-center items-center self-start mt-1 min-h-4">
                  <img
                    src={schedule.icon}
                    alt={`${schedule.title} icon`}
                    className="object-contain self-stretch my-auto w-3.5 aspect-[0.87]"
                  />
                </div>
                <h3 className="text-base leading-none text-gray-700 basis-auto">
                  {schedule.title}
                </h3>
              </div>
              <time className="text-sm leading-none text-gray-500">
                {schedule.date}
              </time>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}