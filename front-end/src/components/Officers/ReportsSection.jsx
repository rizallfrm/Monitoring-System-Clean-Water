"use client";
import { useState, useEffect } from "react";
import { DataTable } from "./DataTable";
import reportService from "../../services/reportService"; // Adjust the import path as needed

export function ReportsSection({ onAddAction }) {
  const [data, setData] = useState([]);
  const [completedReports, setCompletedReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch reports data from API when component mounts
  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await reportService.getAllReports();
        setData(response.data); // Assuming the response has a data property
      } catch (err) {
        setError(err.message || "Gagal mengambil data laporan");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);
  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  // Handle updating report status to "Completed"
  const handleComplete = async (reportId) => {
    try {
      await reportService.completeReport(reportId);

      // Update local state if successful
      setData((prevData) =>
        prevData.map((report) =>
          report.id === reportId ? { ...report, status: "Selesai" } : report
        )
      );

      setCompletedReports((prev) => ({
        ...prev,
        [reportId]: true,
      }));
    } catch (err) {
      alert(err.message || "Gagal update status laporan");
    }
  };

  const columns = [
    { key: "id", header: "ID Laporan" },
    { key: "description", header: "Deskripsi" },
    { key: "location", header: "Lokasi" },
    { key: "status", header: "Status" },
    { key: "date", header: "Tanggal" },
    { key: "actions", header: "Tindakan" },
  ];

  const renderActions = (row) => (
    <div className="flex gap-3 max-sm:flex-col max-sm:gap-2">
      <button
        className="flex gap-1 justify-center items-center px-3 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg cursor-pointer border-none max-sm:w-full"
        onClick={onAddAction}
      >
        <svg width="12" height="13" viewBox="0 0 12 13" fill="none">
          <path
            d="M6.98438 2.375C6.98438 1.96016 6.64922 1.625 6.23438 1.625C5.81953 1.625 5.48438 1.96016 5.48438 2.375V5.75H2.10938C1.69453 5.75 1.35938 6.08516 1.35938 6.5C1.35938 6.91484 1.69453 7.25 2.10938 7.25H5.48438V10.625C5.48438 11.0398 5.81953 11.375 6.23438 11.375C6.64922 11.375 6.98438 11.0398 6.98438 10.625V7.25H10.3594C10.7742 7.25 11.1094 6.91484 11.1094 6.5C11.1094 6.08516 10.7742 5.75 10.3594 5.75H6.98438V2.375Z"
            fill="white"
          />
        </svg>
        <span>Tambah Tindakan</span>
      </button>
      <button
        className="flex gap-1 justify-center items-center px-3 py-2 text-xs font-bold text-white bg-green-500 rounded-lg cursor-pointer border-none max-sm:w-full"
        onClick={() => handleComplete(row.id)}
        disabled={row.status !== "Menunggu" || completedReports[row.id]}
        style={{
          background: completedReports[row.id] ? "#9CA3AF" : "#22C55E",
          cursor: completedReports[row.id] ? "not-allowed" : "pointer",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M6.09375 12.5C7.68505 12.5 9.21117 11.8679 10.3364 10.7426C11.4616 9.61742 12.0937 8.0913 12.0938 6.5C12.0937 4.9087 11.4616 3.38258 10.3364 2.25736C9.21117 1.13214 7.68505 0.5 6.09375 0.5C4.50245 0.5 2.97633 1.13214 1.85111 2.25736C0.725891 3.38258 0.09375 4.9087 0.09375 6.5C0.09375 8.0913 0.725891 9.61742 1.85111 10.7426C2.97633 11.8679 4.50245 12.5 6.09375 12.5Z"
            fill="white"
          />
        </svg>
        <span>Selesai</span>
      </button>
    </div>
  );

  if (loading) return <p>Memuat data laporan...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section className="flex flex-col gap-4 mb-10 w-[1104px] max-md:w-full">
      <h2 className="text-xl font-bold leading-5 text-gray-900 max-sm:text-lg">
        Tabel Laporan
      </h2>
      <DataTable
        columns={columns}
        data={[]} // data default kosong
        dataType="reports"
        refreshTrigger={refreshKey}
      />{" "}
    </section>
  );
}

export default ReportsSection;
