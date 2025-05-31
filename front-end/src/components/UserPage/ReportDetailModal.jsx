import React, { useState } from "react"; // Jangan lupa import useState
import StatusTimeline from "./StatusTimeline";
import reportService from "../../services/reportService"; // Import service untuk cancel report

const ReportDetail = ({ report, statusHistory, onClose, loading }) => {
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fungsi untuk handle cancel report
  const handleCancelReport = async () => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan laporan ini?"))
      return;

    try {
      setIsCancelling(true);
      setError(null);

      await reportService.cancelReport(report.report_id);
      alert("Laporan berhasil dibatalkan");
      onClose(); // Tutup modal setelah berhasil dibatalkan

      // Anda mungkin perlu menambahkan fungsi refresh data parent component
      // melalui prop jika diperlukan
    } catch (err) {
      console.error("Gagal membatalkan laporan:", err);
      setError(err.message || "Gagal membatalkan laporan");
    } finally {
      setIsCancelling(false);
    }
  };

  // Format data report sesuai dengan response API
  const formattedReport = {
    ...report,
    status: (report.status || "").toLowerCase(),
    createdAt: report.created_at,
    updatedAt: report.updated_at || report.created_at,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Detail Laporan</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isCancelling}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tampilkan error jika ada */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-sm text-red-600 hover:text-red-800"
              >
                Tutup
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Konten detail laporan */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {formattedReport.title || "Tidak ada judul"}
                </h3>
                <p className="mt-2 text-gray-600">
                  {formattedReport.description}
                </p>
                {formattedReport.location && (
                  <p className="mt-2 text-gray-600">
                    <strong>Lokasi:</strong> {formattedReport.location}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p
                    className={`mt-1 text-sm ${
                      formattedReport.status === "pending"
                        ? "text-yellow-600"
                        : formattedReport.status === "in_progress"
                        ? "text-blue-600"
                        : formattedReport.status === "resolved"
                        ? "text-green-600"
                        : formattedReport.status === "cancelled"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {formattedReport.status.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Dibuat Pada
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(formattedReport.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Pelapor</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {formattedReport.reporter?.name || "Tidak diketahui"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Prioritas
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 capitalize">
                    {formattedReport.priority}
                  </p>
                </div>
              </div>

              {/* Riwayat status */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Riwayat Status
                </h4>
                <StatusTimeline statusHistory={statusHistory} />
              </div>

              {/* Tombol aksi */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                {/* Tombol Cancel hanya muncul jika status 'pending' */}
                {formattedReport.status === "pending" && (
                  <button
                    onClick={handleCancelReport}
                    disabled={isCancelling}
                    className={`px-4 py-2 rounded text-white ${
                      isCancelling
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isCancelling ? "Memproses..." : "Batalkan Laporan"}
                  </button>
                )}

                <button
                  onClick={onClose}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
