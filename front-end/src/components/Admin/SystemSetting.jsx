function SystemSettings() {
    return (
      <section className="mb-10" id="settings">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">System Settings</h2>
        <form className="bg-white rounded-lg shadow p-6 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* pH Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="alert-threshold-ph">
                pH Alert Threshold
              </label>
              <input
                type="number"
                id="alert-threshold-ph"
                name="alert-threshold-ph"
                min="0"
                max="14"
                step="0.1"
                defaultValue="6.5"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum acceptable pH value</p>
            </div>
  
            {/* Turbidity Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="alert-threshold-turbidity">
                Turbidity Alert Threshold (NTU)
              </label>
              <input
                type="number"
                id="alert-threshold-turbidity"
                name="alert-threshold-turbidity"
                step="0.1"
                defaultValue="5"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum safe turbidity level</p>
            </div>
  
            {/* Temperature Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="alert-threshold-temp">
                Temperature Alert Threshold (°C)
              </label>
              <input
                type="number"
                id="alert-threshold-temp"
                name="alert-threshold-temp"
                step="0.1"
                defaultValue="25"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum acceptable temperature</p>
            </div>
  
            {/* Flow Rate Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="alert-threshold-flow">
                Flow Rate Alert Threshold (L/min)
              </label>
              <input
                type="number"
                id="alert-threshold-flow"
                name="alert-threshold-flow"
                step="0.1"
                defaultValue="10"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum flow rate before alert</p>
            </div>
          </div>
  
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </section>
    );
  }
  
  export default SystemSettings;
  