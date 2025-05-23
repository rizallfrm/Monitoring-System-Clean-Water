function SensorManagement() {
    const sensors = [
      { id: "SEN-001", type: "pH Sensor", location: "Intake Valve", status: "Active", reading: "7.2 (5 mins ago)", battery: "85%" },
      { id: "SEN-002", type: "Turbidity Sensor", location: "Filter Outlet", status: "Active", reading: "1.1 NTU (3 mins ago)", battery: "78%" },
      { id: "SEN-003", type: "Temperature Sensor", location: "Storage Tank", status: "Warning", reading: "18.5 °C (10 mins ago)", battery: "60%" },
      { id: "SEN-004", type: "Flow Rate Sensor", location: "Main Pipeline", status: "Active", reading: "12.4 L/min (2 mins ago)", battery: "90%" },
      { id: "SEN-005", type: "Chlorine Sensor", location: "Disinfection Unit", status: "Offline", reading: "N/A", battery: "0%" },
    ];
  
    const statusStyles = {
      Active: "bg-green-100 text-green-800",
      Warning: "bg-yellow-100 text-yellow-800",
      Offline: "bg-red-100 text-red-800",
    };
  
    return (
      <section className="mb-10" id="sensors">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sensor Management</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                {["Sensor ID", "Type", "Location", "Status", "Last Reading", "Battery", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sensors.map((sensor) => (
                <tr key={sensor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sensor.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sensor.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sensor.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusStyles[sensor.status]}`}>
                      <i className={`fas ${sensor.status === "Warning" ? "fa-exclamation-triangle" : sensor.status === "Offline" ? "fa-times-circle" : "fa-check-circle"} mr-1`}></i>
                      {sensor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sensor.reading}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sensor.battery}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 focus:outline-none" title="Edit sensor">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-900 focus:outline-none" title="Delete sensor">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  
  export default SensorManagement;
  