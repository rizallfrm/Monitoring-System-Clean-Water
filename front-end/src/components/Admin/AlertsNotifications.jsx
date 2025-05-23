function AlertsNotifications() {
    const alerts = [
      {
        title: "Chlorine Sensor Offline",
        desc: "The chlorine sensor at the Disinfection Unit has been offline for 2 hours.",
        time: "June 16, 2024, 2:30 PM",
        icon: "fas fa-exclamation-circle",
        color: "border-red-500 text-red-600",
      },
      {
        title: "Temperature Sensor Warning",
        desc: "Water temperature in Storage Tank is approaching upper limit (18.5°C).",
        time: "June 16, 2024, 9:15 AM",
        icon: "fas fa-exclamation-triangle",
        color: "border-yellow-400 text-yellow-600",
      },
      {
        title: "All Systems Normal",
        desc: "No critical alerts at this time. System operating within normal parameters.",
        time: "June 16, 2024, 7:00 AM",
        icon: "fas fa-check-circle",
        color: "border-green-500 text-green-600",
      },
    ];
  
    return (
      <section className="mb-10" id="alerts">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Alerts & Notifications</h2>
        <ul className="space-y-4">
          {alerts.map((alert, index) => (
            <li
              key={index}
              className={`bg-white rounded-lg shadow p-4 flex items-start space-x-4 border-l-4 ${alert.color}`}
            >
              <i className={`${alert.icon} text-2xl mt-1`}></i>
              <div>
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-gray-600">{alert.desc}</p>
                <time className="text-xs text-gray-400">{alert.time}</time>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  
  export default AlertsNotifications;
  