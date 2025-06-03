import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  UserCheck,
  CheckCircle,
  XCircle,
  Droplets,
  Activity,
  AlertTriangle,
  Calendar,
  Filter,
  ChevronDown,
  MapPin,
  Shield,
} from "lucide-react";
import reportService from "../../services/reportService";
import userService from "../../services/userService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/LandingPage/Footer";

const statusColors = {
  Pending: {
    displayText: "Menunggu", // Tambahkan displayText
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: AlertTriangle,
    gradient: "from-amber-400 to-orange-500",
  },
  "On-Going": {
    displayText: "Dikerjakan", // Ganti On-Going menjadi Dikerjakan
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: Activity,
    gradient: "from-blue-400 to-cyan-500",
  },
  Completed: {
    displayText: "Selesai", // Tetap Selesai
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    icon: CheckCircle,
    gradient: "from-green-400 to-emerald-500",
  },
  Cancelled: {
    displayText: "Dibatalkan", // Tetap Dibatalkan
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    icon: XCircle,
    gradient: "from-red-400 to-pink-500",
  },
};

const ReportManagementPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [officersLoading, setOfficersLoading] = useState(false);

  const fetchOfficers = async () => {
    try {
      setOfficersLoading(true);
      const data = await userService.getOfficers();

      console.log("Raw officers data:", data);

      const validOfficers = Array.isArray(data)
        ? data.filter((officer) => officer?.user_id && officer?.name)
        : [];

      console.log("Valid officers:", validOfficers);
      setOfficers(validOfficers);
    } catch (err) {
      console.error("Gagal mengambil data petugas:", err);
      setError(err.message || "Gagal memuat daftar petugas");
    } finally {
      setOfficersLoading(false);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAllReports();

        const normalizedReports = Array.isArray(data)
          ? data.map((report, index) => ({
              ...report,
              id: report.report_id || index + 1,
            }))
          : [];

        setReports(normalizedReports);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    fetchOfficers(); // Now we can call it here
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAssignClick = (reportId) => {
    console.log("Opening assign dialog for report:", reportId);
    setSelectedReportId(reportId);
    setAssignDialogOpen(true);
    setSelectedOfficer(null);
  };

  const handleAssignConfirm = async () => {
    if (!selectedReportId || !selectedOfficer) return;

    try {
      setAssignLoading(true);
      await reportService.assignOfficer(selectedReportId, selectedOfficer);
      // Update UI
      setReports(
        reports.map((report) =>
          report.report_id === selectedReportId
            ? {
                ...report,
                status: "On-Going",
                assigned_to: officers.find((o) => o.user_id === selectedOfficer)
                  ?.name,
              }
            : report
        )
      );

      setAssignDialogOpen(false);
      setSelectedReportId(null);
      setSelectedOfficer(null);

      // Notifikasi sukses
      console.log("Petugas berhasil ditugaskan!");
    } catch (err) {
      console.error("Gagal menugaskan petugas:", err);
      console.log(err.message || "Gagal menugaskan petugas");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedOfficer(null);
    setSelectedReportId(null);
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

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "Pending").length,
    ongoing: reports.filter((r) => r.status === "On-Going").length,
    completed: reports.filter((r) => r.status === "Completed").length,
    cancelled: reports.filter((r) => r.status === "Cancelled").length,
  };

  const StatusBadge = ({ status }) => {
    const config = statusColors[status] || statusColors.Pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}
      >
        <IconComponent className="w-3 h-3 mr-1.5" />
        {config.displayText} {/* Gunakan displayText bukan status langsung */}
      </span>
    );
  };
  const StatCard = ({ title, value, status, icon: Icon }) => {
    const config = statusColors[status] || {
      gradient: "from-gray-400 to-gray-600",
    };

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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Water Monitoring System
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the latest reports...
            </p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
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
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              System Error
            </h3>
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <Navbar />
          <div className="mb-8 ">
            <div className="relative  overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-xl">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-600/10"></div>
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-white">
                          Report Management
                        </h1>
                        <p className="text-blue-100 mt-2">
                          Pantau dan kelola seluruh laporan masuk secara
                          real-time. <br />
                          Lacak status, tanggapi keluhan dengan menugaskan petugas, dan optimalkan
                          resolusi masalah dengan workflow terstruktur.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3"></div>
                </div>
              </div>
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
            </div>
          </div>

          {/* Reports Grid */}
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <Droplets className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak ada laporan ditemukan
                </h3>
                <p className="text-gray-500 mb-6">
                  Coba sesuaikan kriteria pencarian atau filter Anda
                </p>
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
                  key={`report-${report.id}`} // Pastikan report.id unik
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        {/* Bagian kiri - Status dan Deskripsi */}
                        <div className="space-y-2 flex-1">
                          <StatusBadge status={report.status} />
                          <h3 className="text-l pt-2 font-light text-gray-900">
                            Deskripsi Laporan:
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {report.description &&
                            report.description.length > 150
                              ? `${report.description.substring(0, 150)}...`
                              : report.description || "Tidak ada deskripsi"}
                          </p>
                        </div>

                        {/* Informasi Reporter */}
                        {report.reporter && (
                          <div className="ml-4 flex items-center space-x-2 bg-transparent rounded-xl p-3 border border-gray-100">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-inner">
                                <span className="text-sm font-semibold text-blue-600">
                                  {report.reporter.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {report.reporter.name}
                              </p>
                              {report.reporter.email && (
                                <p className="text-xs text-gray-500 truncate">
                                  {report.reporter.email}
                                </p>
                              )}
                              <p className="text-xs mt-1 text-blue-600 font-medium">
                                Pelapor
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Informasi tambahan (tanggal, lokasi, petugas) */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>
                              {new Date(report.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-green-500" />
                            <span className="truncate">
                              {report.location || "Lokasi tidak diketahui"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-4 h-4 text-purple-500" />
                            <span>
                              {report.assigned_to || "Belum ditugaskan"}
                            </span>
                          </div>
                        </div>
                        {report.status === "Pending" && (
                          <div className="ml-6 flex-shrink-0">
                            <button
                              onClick={() => handleAssignClick(report.id)}
                              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl space-x-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span className="font-medium">
                                Tugaskan Petugas
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assign Officer Dialog */}
        {assignDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              {/* Dialog Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tugaskan Petugas
                </h2>
                <button
                  onClick={handleCloseAssignDialog}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Dialog Content */}
              <p className="text-gray-600 mb-6">
                Pilih petugas untuk menangani laporan ini
                {selectedReportId && (
                  <span className="block text-sm text-blue-600 mt-1">
                    Report ID: {selectedReportId}
                  </span>
                )}
              </p>

              {/* Daftar Petugas - BAGIAN INI YANG DIPERBAIKI */}
              {officersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Memuat daftar petugas...</p>
                </div>
              ) : officers.length > 0 ? (
                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                  {officers.map((officer) => (
                    <div
                      key={`officer-${officer.user_id}`}
                      onClick={() =>
                        !assignLoading && setSelectedOfficer(officer.user_id)
                      }
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedOfficer === officer.user_id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      } ${
                        assignLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {officer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {officer.username && `@${officer.username}`}
                            {officer.email && ` • ${officer.email}`}
                          </p>
                        </div>
                        {selectedOfficer === officer.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                    <UserCheck className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Tidak ada petugas tersedia</p>
                  <button
                    onClick={fetchOfficers}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Coba Muat Ulang
                  </button>
                </div>
              )}

              {/* Dialog Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseAssignDialog}
                  className="px-6 py-2 text-gray-700 rounded-xl hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleAssignConfirm}
                  disabled={!selectedOfficer || assignLoading}
                  className={`px-6 py-2 rounded-xl text-white ${
                    selectedOfficer && !assignLoading
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {assignLoading ? "Menugaskan..." : "Tugaskan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close filter dropdown */}
        {showFilterDropdown && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowFilterDropdown(false)}
          />
        )}
      </div>

      <Footer />
    </>
  );
};

export default ReportManagementPage;
