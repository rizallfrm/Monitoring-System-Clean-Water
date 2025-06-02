import React, { useEffect, useState } from "react";
import ReportDetail from "./ReportDetailModal";
import reportService from "../../services/reportService";
import statusService from "../../services/statusService";
import {
  Eye,
  X,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Droplets,
  Filter,
  Search,
  Waves,
  TrendingUp,
  Activity,
  RefreshCw,
  Archive,
  AlertCircle,
} from "lucide-react";

const ReportList = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredReports, setFilteredReports] = useState(reports);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter reports based on status and search term
  useEffect(() => {
    let filtered = reports;

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [reports, statusFilter, searchTerm]);

  const handleViewDetails = async (reportId) => {
    try {
      setLoading(true);
      setError(null);

      const [report, history] = await Promise.all([
        reportService.getReportById(reportId),
        statusService.getStatusHistoryByReportId(reportId).catch((err) => {
          console.warn("Failed to get history, using empty array:", err);
          return [];
        }),
      ]);

      setSelectedReport(report);
      setStatusHistory(history);
    } catch (err) {
      console.error("Error in handleViewDetails:", err);
      setError(err.message || "Gagal memuat detail laporan");

      if (selectedReport) {
        setStatusHistory([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReport = async (reportId) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan laporan ini?"))
      return;

    try {
      setLoading(true);
      setError(null);

      await reportService.cancelReport(reportId);
      alert("Laporan berhasil dibatalkan");
      setSelectedReport(null);
    } catch (err) {
      setError(err.message || "Gagal membatalkan laporan");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "On-Going":
        return <Activity className="h-4 w-4" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancel":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-300 shadow-amber-100";
      case "On-Going":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300 shadow-blue-100";
      case "Completed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-green-100";
      case "Cancel":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300 shadow-red-100";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300 shadow-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Menunggu";
      case "On-Going":
        return "Dikerjakan";
      case "Completed":
        return "Selesai";
      case "Cancel":
        return "Dibatalkan";
      default:
        return status;
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-700 shadow-red-100";
      case "medium":
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 text-yellow-700 shadow-yellow-100";
      case "low":
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-700 shadow-green-100";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 text-gray-700 shadow-gray-100";
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: reports.length,
      Pending: reports.filter((r) => r.status === "Pending").length,
      "On-Going": reports.filter((r) => r.status === "On-Going").length,
      Completed: reports.filter((r) => r.status === "Completed").length,
      Cancel: reports.filter((r) => r.status === "Cancel").length,
    };
    return stats;
  };
  const stats = getStatusStats();

  if (loading && !selectedReport) {
    return (
      <div className="flex justify-center py-16">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 opacity-20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Memuat Laporan
            </h3>
            <p className="text-gray-600">Sedang mengambil data terbaru...</p>
          </div>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-xl">
            <Droplets className="h-12 w-12 text-blue-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Belum Ada Laporan Monitoring
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Sistem monitoring air PDAM siap digunakan. Mulai dengan membuat
          laporan pertama untuk memantau kualitas air di area Anda.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Refresh Halaman</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-red-800 font-semibold text-lg">
                Terjadi Kesalahan
              </h4>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan deskripsi atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6">
        {filteredReports.map((report, index) => (
          <div
            key={report.report_id}
            className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:border-blue-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                      {(report.description || "Laporan Tanpa Judul").substring(
                        0,
                        80
                      )}
                      {report.description &&
                        report.description.length > 80 &&
                        "..."}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-xl border shadow-sm ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        <span>{getStatusText(report.status)}</span>
                      </span>

                      {report.priority && (
                        <span
                          className={`px-3 py-2 text-sm font-semibold rounded-xl border shadow-sm ${getPriorityColor(
                            report.priority
                          )}`}
                        >
                          Prioritas{" "}
                          {report.priority === "high"
                            ? "Tinggi"
                            : report.priority === "medium"
                            ? "Sedang"
                            : "Rendah"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {new Date(report.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {report.location && (
                    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium truncate max-w-64">
                        {report.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description Preview */}
                {report.description && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {report.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="py-5 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleViewDetails(report.report_id)}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Eye className="h-4 w-4" />
                  <span>Lihat Detail</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && reports.length > 0 && (
        <div className="text-center py-16">
          <div className="relative mb-8">
            <div className="bg-gradient-to-br from-gray-100 to-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full animate-pulse opacity-75"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Tidak Ada Hasil Ditemukan
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Tidak ditemukan laporan yang sesuai dengan kriteria pencarian dan
            filter yang Anda tentukan.
          </p>
        </div>
      )}

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
