import { useEffect, useState } from 'react';
import statusService from '../../services/statusService';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await statusService.getAllStatusUpdates({
          limit: 2,
          sort: 'createdAt:desc'
        });
        
        setNotifications(response.data.map(item => ({
          id: item._id,
          icon: item.type === 'warning' 
            ? 'https://cdn.builder.io/api/v1/image/assets/TEMP/a7f6797e4c727f6e392828425fed8fd1b10b1f2e' 
            : 'https://cdn.builder.io/api/v1/image/assets/TEMP/26b0fd6d09a90f0be62141436307d1c088d45511',
          message: item.message,
          type: item.type
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <div className="p-6">Memuat notifikasi...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <article className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
      <div className="grow p-6 w-full bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5 max-md:mt-6 max-md:max-w-full">
        <h2 className="pt-px pb-3 text-lg font-bold text-gray-800 whitespace-nowrap bg-black bg-opacity-0 max-md:pr-5 max-md:max-w-full">
          Notifikasi
        </h2>
        <div className="mt-4 w-full bg-black bg-opacity-0 max-md:max-w-full">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex flex-wrap gap-3 py-0.5 w-full bg-black bg-opacity-0 max-md:max-w-full mt-3 first:mt-0"
            >
              <div className="flex overflow-hidden justify-center items-center self-start mt-1 min-h-4">
                <img
                  src={notification.icon}
                  alt="Notification icon"
                  className="object-contain self-stretch my-auto w-3.5 aspect-[0.87]"
                />
              </div>
              <p
                className={`flex-auto text-base leading-none ${
                  notification.type === 'warning'
                    ? 'text-amber-500'
                    : 'text-blue-500'
                } w-[535px] max-md:max-w-full`}
              >
                {notification.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}