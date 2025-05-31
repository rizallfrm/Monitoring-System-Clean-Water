import { useEffect, useState } from "react";
import actionService from "../../services/actionService";
import reportService from "../../services/reportService";
import statusService from "../../services/statusService";
import userService from "../../services/userService";

export function DataTable({
  columns = [],
  data: initialData = [],
  actions,
  dataType,
  refreshTrigger,
}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      switch (dataType) {
        case "actions":
          response = await actionService.getAllActions();
          break;
        case "reports":
          response = await reportService.getAllReports();
          break;
        case "status":
          response = await statusService.getAllStatusUpdates();
          break;
        case "users":
          response = await userService.getAllUsers();
          break;
        default:
          setData(initialData);
          return;
      }

      // Pastikan data dalam format array
      const resultData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      setData(resultData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
      setData(initialData); // Kembalikan ke data awal
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataType) {
      fetchData();
    } else {
      setData(initialData);
    }
  }, [dataType, refreshTrigger, initialData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
        <button
          onClick={fetchData}
          className="ml-2 text-blue-500 hover:text-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!Array.isArray(columns) || columns.length === 0) {
    return (
      <div className="text-red-500 p-4">
        Kolom tidak terdefinisi dengan benar
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-gray-500 p-4">Tidak ada data yang tersedia</div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-white rounded-xl shadow w-[1104px] max-md:overflow-x-auto max-md:w-full">
      <table className="border-collapse w-[1104px] max-md:min-w-[800px]">
        {/* ... bagian thead tetap sama ... */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`p-5 text-sm text-gray-800 ${
                    rowIndex === 0
                      ? ""
                      : "border-t border-solid border-t-gray-100"
                  }`}
                >
                  {column.key === "actions" && actions
                    ? actions(row)
                    : row[column.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
