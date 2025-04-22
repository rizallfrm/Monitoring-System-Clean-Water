export default function NotificationPanel() {
    const notifications = [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a7f6797e4c727f6e392828425fed8fd1b10b1f2e?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff",
        message: "Pemeriksaan kualitas air minggu ini",
        type: "warning",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/26b0fd6d09a90f0be62141436307d1c088d45511?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff",
        message: "Update sistem monitoring mendatang",
        type: "info",
      },
    ];
  
    return (
      <article className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
        <div className="grow p-6 w-full bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5 max-md:mt-6 max-md:max-w-full">
          <h2 className="pt-px pb-3 text-lg font-bold text-gray-800 whitespace-nowrap bg-black bg-opacity-0 max-md:pr-5 max-md:max-w-full">
            Notifikasi
          </h2>
          <div className="mt-4 w-full bg-black bg-opacity-0 max-md:max-w-full">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`flex flex-wrap gap-3 py-0.5 w-full bg-black bg-opacity-0 max-md:max-w-full ${
                  index > 0 ? "mt-3" : ""
                }`}
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
                    notification.type === "warning"
                      ? "text-amber-500"
                      : "text-blue-500"
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
  