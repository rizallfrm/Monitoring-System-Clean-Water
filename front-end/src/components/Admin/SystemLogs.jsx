function SystemLogs() {
    const logs = [
      { timestamp: "2024-06-16 14:30", event: "Sensor SEN-005 went offline", user: "System", details: "Chlorine sensor stopped responding." },
      { timestamp: "2024-06-16 09:15", event: "Temperature warning on SEN-003", user: "System", details: "Water temperature approaching upper limit." },
      { timestamp: "2024-06-15 16:00", event: "User Ahmad Fauzi updated alert thresholds", user: "Ahmad Fauzi", details: "Changed pH min to 6.5 and turbidity max to 5 NTU." },
      { timestamp: "2024-06-14 11:20", event: "New user Siti Nurhaliza added", user: "Ahmad Fauzi", details: "Role: Operator" },
    ];
  
    return (
      <section className="mb-10" id="logs">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">System Logs</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                {["Timestamp", "Event", "User", "Details"].map((header) => (
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
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  
  export default SystemLogs;
  