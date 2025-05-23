function DashboardOverview() {
    return (
      <section className="mb-10" id="dashboard">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Water Quality (pH)",
              value: "7.2",
              icon: "fas fa-tint",
              bg: "bg-blue-100",
              color: "text-blue-600",
              note: "Normal range: 6.5 - 8.5",
            },
            {
              title: "Turbidity (NTU)",
              value: "1.1",
              icon: "fas fa-water",
              bg: "bg-green-100",
              color: "text-green-600",
              note: "Safe level: < 5 NTU",
            },
            {
              title: "Water Temperature (°C)",
              value: "18.5",
              icon: "fas fa-thermometer-half",
              bg: "bg-yellow-100",
              color: "text-yellow-600",
              note: "Optimal: 15 - 25 °C",
            },
            {
              title: "Flow Rate (L/min)",
              value: "12.4",
              icon: "fas fa-tachometer-alt",
              bg: "bg-purple-100",
              color: "text-purple-600",
              note: "Normal range: 10 - 20 L/min",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 ${item.bg} rounded-full ${item.color}`}>
                  <i className={`${item.icon} fa-2x`}></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-400">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default DashboardOverview;
  