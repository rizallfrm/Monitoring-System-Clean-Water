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
  Search
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
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    if (!window.confirm("Apakah Anda yakin ingin membatalkan laporan ini?")) return;

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
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 'in_progress':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'resolved':
        return "bg-green-100 text-green-800 border-green-200";
      case 'cancelled':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return "Menunggu";
      case 'in_progress':
        return "Diproses";
      case 'resolved':
        return "Selesai";
      case 'cancelled':
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return "bg-red-50 border-red-200 text-red-700";
      case 'medium':
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case 'low':
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  if (loading && !selectedReport) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600">Memuat laporan...</p>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Droplets className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Laporan</h3>
        <p className="text-gray-500 mb-6">Anda belum membuat laporan air PDAM. Mulai buat laporan pertama Anda!</p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Halaman
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Terjadi Kesalahan</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan deskripsi atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="in_progress">Diproses</option>
              <option value="resolved">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.report_id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {(report.description || "Laporan Tanpa Judul").substring(0, 60)}
                    {report.description && report.description.length > 60 && "..."}
                  </h3>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span>{getStatusText(report.status)}</span>
                    </span>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(report.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                  
                  {report.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate max-w-48">{report.location}</span>
                    </div>
                  )}
                  
                  {report.priority && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(report.priority)}`}>
                      Prioritas {report.priority === 'high' ? 'Tinggi' : report.priority === 'medium' ? 'Sedang' : 'Rendah'}
                    </span>
                  )}
                </div>

                {/* Description Preview */}
                {report.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {report.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleViewDetails(report.report_id)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Detail</span>
                </button>
                
                {report.status === "pending" && (
                  <button
                    onClick={() => handleCancelReport(report.report_id)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors border border-red-200"
                  >
                    <X className="h-4 w-4" />
                    <span>Batal</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && reports.length > 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Hasil</h3>
          <p className="text-gray-500">Tidak ditemukan laporan yang sesuai dengan filter Anda.</p>
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