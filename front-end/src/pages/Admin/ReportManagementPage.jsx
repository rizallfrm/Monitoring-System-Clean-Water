import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  UserCheck,
  XCircle,
  CheckCircle,
  Droplets,
  Activity,
  AlertTriangle,
  Calendar,
  Filter,
  ChevronDown,
  MapPin,
  Clock
} from "lucide-react";
import reportService from "../../services/reportService";

// Mock data untuk demo


const statusColors = {
  Pending: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: AlertTriangle,
    gradient: "from-amber-400 to-orange-500"
  },
  "On-Going": {
    bg: "bg-blue-100", 
    text: "text-blue-800",
    border: "border-blue-200",
    icon: Activity,
    gradient: "from-blue-400 to-cyan-500"
  },
  Completed: {
    bg: "bg-green-100",
    text: "text-green-800", 
    border: "border-green-200",
    icon: CheckCircle,
    gradient: "from-green-400 to-emerald-500"
  },
  Cancelled: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200", 
    icon: XCircle,
    gradient: "from-red-400 to-pink-500"
  },
};

const ReportManagementPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Simulate API loading
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAllReports();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleActionClick = (reportId) => {
    setSelectedReportId(reportId);
    setShowActionMenu(!showActionMenu);
  };

  const handleViewReport = () => {
    alert(`Viewing report ${selectedReportId}`);
    setShowActionMenu(false);
  };

  const handleAssignClick = () => {
    setAssignDialogOpen(true);
    setShowActionMenu(false);
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
    setShowActionMenu(false);
  };

  const handleCompleteClick = () => {
    setCompleteDialogOpen(true);
    setShowActionMenu(false);
  };

  const handleAssignConfirm = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(
        reports.map((report) =>
          report.id === selectedReportId
            ? { ...report, status: "On-Going", assigned_to: "Officer Rahman" }
            : report
        )
      );

      setAssignDialogOpen(false);
    } catch (err) {
      console.error("Error assigning officer:", err);
      setError(err.message || "Failed to assign officer");
    }
  };

  const handleCancelConfirm = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(
        reports.map((report) =>
          report.id === selectedReportId
            ? { ...report, status: "Cancelled" }
            : report
        )
      );

      setCancelDialogOpen(false);
    } catch (err) {
      console.error("Error cancelling report:", err);
      setError(err.message || "Failed to cancel report");
    }
  };

  const handleCompleteConfirm = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(
        reports.map((report) =>
          report.id === selectedReportId
            ? { ...report, status: "Completed" }
            : report
        )
      );

      setCompleteDialogOpen(false);
    } catch (err) {
      console.error("Error completing report:", err);
      setError(err.message || "Failed to complete report");
    }
  };

  const filteredReports = reports
    .filter((report) => {
      const title = report.title?.toLowerCase() || "";
      const description = report.description?.toLowerCase() || "";
      const status = report.status?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        title.includes(search) ||
        description.includes(search) ||
        status.includes(search)
      );
    })
    .filter(
      (report) => statusFilter === "All" || report.status === statusFilter
    );

  // Statistics
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "Pending").length,
    ongoing: reports.filter(r => r.status === "On-Going").length,
    completed: reports.filter(r => r.status === "Completed").length,
    cancelled: reports.filter(r => r.status === "Cancelled").length
  };

  const StatusBadge = ({ status }) => {
    const config = statusColors[status] || statusColors.Pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        <IconComponent className="w-3 h-3 mr-1.5" />
        {status}
      </span>
    );
  };

  const StatCard = ({ title, value, status, icon: Icon }) => {
    const config = statusColors[status] || { gradient: "from-gray-400 to-gray-600" };
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${config.gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const ActionMenu = ({ report }) => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
      <div className="py-1">
        <button
          onClick={handleViewReport}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        {report.status === "Pending" && (
          <button
            onClick={handleAssignClick}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Assign Officer
          </button>
        )}
        {report.status === "On-Going" && (
          <button
            onClick={handleCompleteClick}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center transition-colors"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Complete
          </button>
        )}
        {report.status !== "Cancelled" && report.status !== "Completed" && (
          <button
            onClick={handleCancelClick}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Report
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 animate-pulse">
                <Droplets className="w-10 h-10 text-white animate-bounce" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Water Monitoring System</h3>
            <p className="text-gray-600">Please wait while we fetch the latest reports...</p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">System Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-lg">
                <Droplets className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  PDAM Water Monitoring
                </h1>
                <p className="text-gray-600 text-lg">Sistem Monitoring Kualitas Air & Penanganan Laporan</p>
              </div>
            </div>
            <button
              onClick={() => alert('Navigate to create new report')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Buat Laporan Baru</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Laporan"
            value={stats.total}
            status="Pending"
            icon={Droplets}
          />
          <StatCard
            title="Menunggu"
            value={stats.pending}
            status="Pending"
            icon={AlertTriangle}
          />
          <StatCard
            title="Sedang Ditangani"
            value={stats.ongoing}
            status="On-Going"
            icon={Activity}
          />
          <StatCard
            title="Selesai"
            value={stats.completed}
            status="Completed"
            icon={CheckCircle}
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari laporan berdasarkan judul, deskripsi, atau status..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 min-w-[180px] transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>{statusFilter === "All" ? "Semua Status" : statusFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-10">
                  <div className="py-2">
                    {["All", "Pending", "On-Going", "Completed", "Cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilterDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                      >
                        {status === "All" ? "Semua Status" : status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Droplets className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada laporan ditemukan</h3>
              <p className="text-gray-500 mb-6">Coba sesuaikan kriteria pencarian atau filter Anda</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{report.title}</h3>
                        <StatusBadge status={report.status} />
                      </div>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {report.description.length > 150
                          ? `${report.description.substring(0, 150)}...`
                          : report.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{new Date(report.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span className="truncate">{report.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-purple-500" />
                          <span>{report.assigned_to || "Belum ditugaskan"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative ml-4">
                      <button
                        onClick={() => handleActionClick(report.id)}
                        className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {showActionMenu && selectedReportId === report.id && (
                        <ActionMenu report={report} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialogs */}
      {assignDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tugaskan Petugas</h3>
              <p className="text-gray-600">Pilih petugas untuk menangani laporan ini</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AR</span>
                  </div>
                  <div>
                    <p className="font-medium">Ahmad Rahman</p>
                    <p className="text-sm text-gray-500">Senior Water Quality Inspector</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setAssignDialogOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAssignConfirm}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Tugaskan
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Batalkan Laporan</h3>
              <p className="text-gray-600">Apakah Anda yakin ingin membatalkan laporan ini?</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Tidak
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {completeDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Selesaikan Laporan</h3>
              <p className="text-gray-600">Apakah Anda yakin ingin menandai laporan ini sebagai selesai?</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCompleteDialogOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Tidak
              </button>
              <button
                onClick={handleCompleteConfirm}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(showActionMenu || showFilterDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowActionMenu(false);
            setShowFilterDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default ReportManagementPage;