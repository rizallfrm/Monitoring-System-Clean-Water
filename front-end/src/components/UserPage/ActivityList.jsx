export default function ActivityList() {
    const activities = [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/9085638c2f195e3a1a65e856b73c9e75a673abf3?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff",
        title: "Pemeriksaan Kualitas Air",
        date: "22 Apr 2025, 13:00",
        status: "Normal",
        statusColor: "text-emerald-500",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/438cc1a5b1ed2e5f07622af30a4ada1b5aec08f0?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff",
        title: "Maintenance Pipa",
        date: "21 Apr 2025, 09:30",
        status: "Selesai",
        statusColor: "text-blue-500",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/16e2e3e9189a2d622ccce0b15389eb9b5de2c2fc?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff",
        title: "Tekanan Air Rendah",
        date: "20 Apr 2025, 15:45",
        status: "Ditangani",
        statusColor: "text-amber-500",
      },
    ];
  
    return (
      <section className="p-6 mt-7 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5 max-md:mr-0.5 max-md:max-w-full">
        <h2 className="pb-3 text-xl font-bold text-gray-800 bg-black bg-opacity-0 max-md:pr-5 max-md:max-w-full">
          Aktivitas Terkini
        </h2>
        <div className="mt-6 w-full bg-black bg-opacity-0 max-md:max-w-full">
          {activities.map((activity, index) => (
            <div
              key={index}
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
  