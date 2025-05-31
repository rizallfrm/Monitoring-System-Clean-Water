import React, { useEffect, useState } from "react";
import ReportDetail from "./ReportDetailModal";
import reportService from "../../services/reportService";
import statusService from "../../services/statusService";

const ReportList = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tambahkan sementara di ReportList.jsx
  // useEffect(() => {
  //   const testApi = async () => {
  //     try {
  //       const test = await api("report").get("/reports/reports/2");
  //       console.log("Direct API test:", test);
  //     } catch (e) {
  //       console.error("Direct API error:", e);
  //     }
  //   };
  //   testApi();
  // }, []);

  const handleViewDetails = async (reportId) => {
    try {
      setLoading(true);
      setError(null);
  
      const [report, history] = await Promise.all([
        reportService.getReportById(reportId),
        statusService.getStatusHistoryByReportId(reportId).catch((err) => {
          console.warn("Failed to get history, using empty array:", err);
          return []; // Return empty array if history fails
        }),
      ]);

      setSelectedReport(report);
      setStatusHistory(history);
    } catch (err) {
      console.error("Error in handleViewDetails:", err);
      setError(err.message || "Gagal memuat detail laporan");

      // Tetap tampilkan report meskipun history gagal
      if (selectedReport) {
        setStatusHistory([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to cancel this report?")) return;

    try {
      setLoading(true);
      setError(null);

      await reportService.cancelReport(reportId);
      // Ideally, we would refresh the reports list here
      alert("Report cancelled successfully");
      setSelectedReport(null);
    } catch (err) {
      setError(err.message || "Failed to cancel report");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedReport) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You haven't submitted any reports yet.</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>Error: {error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Tutup
          </button>
        </div>
      )}
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.report_id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">
                  {(report.description || "Untitled").substring(0, 30)}...
                </h3>
                <div className="mt-2 flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : report.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : report.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : report.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {report.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(report.report_id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
                {report.status === "pending" && (
                  <button
                    onClick={() => handleCancelReport(report.report_id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          statusHistory={statusHistory}
          onClose={() => setSelectedReport(null)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ReportList;
