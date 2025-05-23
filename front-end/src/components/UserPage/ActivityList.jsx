import { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

export default function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        const response = await reportService.getAllReports({
          limit: 3,
          sort: 'createdAt:desc'
        });
        setActivities(response.data.map(report => ({
          id: report._id,
          icon: getIconByType(report.type),
          title: report.title,
          date: formatDate(report.createdAt),
          status: translateStatus(report.status),
          statusColor: getStatusColor(report.status)
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  const getIconByType = (type) => {
    const icons = {
      'kualitas': 'https://cdn.builder.io/api/v1/image/assets/TEMP/9085638c2f195e3a1a65e856b73c9e75a673abf3',
      'pipa': 'https://cdn.builder.io/api/v1/image/assets/TEMP/438cc1a5b1ed2e5f07622af30a4ada1b5aec08f0',
      'tekanan': 'https://cdn.builder.io/api/v1/image/assets/TEMP/16e2e3e9189a2d622ccce0b15389eb9b5de2c2fc'
    };
    return icons[type] || icons['kualitas'];
  };

  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Menunggu',
      'assigned': 'Ditangani',
      'completed': 'Selesai',
      'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'text-gray-500',
      'assigned': 'text-amber-500',
      'completed': 'text-emerald-500',
      'cancelled': 'text-red-500'
    };
    return colors[status] || 'text-gray-500';
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) return <div className="p-6">Memuat aktivitas...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <section className="p-6 mt-7 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5 max-md:mr-0.5 max-md:max-w-full">
      <h2 className="pb-3 text-xl font-bold text-gray-800 bg-black bg-opacity-0 max-md:pr-5 max-md:max-w-full">
        Aktivitas Terkini
      </h2>
      <div className="mt-6 w-full bg-black bg-opacity-0 max-md:max-w-full">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex flex-wrap gap-5 justify-between py-3.5 w-full bg-black bg-opacity-0 max-md:max-w-full ${
              index < activities.length - 1 ? "border border-b" : ""
            } ${index > 0 ? "mt-4" : ""}`}
          >
            <div className="flex gap-3 bg-black bg-opacity-0">
              <div className="flex overflow-hidden justify-center items-center my-auto min-h-4">
                <img
                  src={activity.icon}
                  alt={`${activity.title} icon`}
                  className="object-contain self-stretch my-auto w-4 aspect-square"
                />
              </div>
              <div className="flex flex-col pr-1.5 pb-1.5 leading-none bg-black bg-opacity-0">
                <h3 className="text-base text-gray-800">{activity.title}</h3>
                <time className="self-start mt-3 text-sm text-gray-500">
                  {activity.date}
                </time>
              </div>
            </div>
            <span
              className={`self-start mt-2.5 text-base leading-none ${activity.statusColor}`}
            >
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}