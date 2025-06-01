import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import reportService from "../services/reportService";
import actionService from "../services/actionService";
import statusService from "../services/statusService";

// Import components
import Sidebar from "../components/Officers/Sidebar";
import StatCard from "../components/Officers/StatCard";
import ReportCard from "../components/Officers/ReportCard";
import ReportsFilter from "../components/Officers/ReportsFilter";
import ActionModal from "../components/Officers/ActionModal";
import ReportDetailModal from "../components/Officers/ReportDetailModal";

const OfficerPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [actions, setActions] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    onGoing: 0,
    completed: 0,
    cancelled: 0,
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionForm, setActionForm] = useState({
    reportId: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium",
  });

  // Load data from API
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load reports dengan error handling yang lebih baik
      const reportsResponse = await reportService.getAllReports();

      if (Array.isArray(reportsResponse)) {
        setReports(reportsResponse);
      } else {
        console.error("Failed to load reports:", reportsResponse.message);
        setError("Gagal memuat data laporan");
      }

      // Load actions
      const actionsResponse = await actionService.getAllActions();
      console.log("Actions response:", actionsResponse);

      if (actionsResponse.success) {
        setActions(actionsResponse.data?.actions || actionsResponse.data || []);
      } else {
        console.error("Failed to load actions:", actionsResponse.message);
      }

      // Load statistics
      const statsResponse = await statusService.getStatusStatistics();
      console.log("Stats response:", statsResponse);

      if (statsResponse.success) {
        const statsData = statsResponse.data || statsResponse;
        setStats({
          pending: statsData.pending || 0,
          onGoing: statsData.onGoing || statsData.ongoing || 0,
          completed: statsData.completed || 0,
          cancelled: statsData.cancelled || 0,
        });
      } else {
        console.error("Failed to load statistics:", statsResponse.message);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle create new action dengan validasi yang lebih baik
  const handleCreateAction = async () => {
    // Validasi form
    if (
      !actionForm.reportId ||
      !actionForm.description ||
      !actionForm.assignedTo ||
      !actionForm.dueDate
    ) {
      alert("Semua field harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const actionData = {
        reportId: actionForm.reportId,
        description: actionForm.description,
        assignedTo: actionForm.assignedTo,
        dueDate: actionForm.dueDate,
        priority: actionForm.priority || "medium",
        status: "planned",
      };

      console.log("Creating action with data:", actionData);
      const response = await actionService.createAction(actionData);

      if (response.success) {
        // Refresh actions list
        const updatedActionsResponse = await actionService.getAllActions();
        if (updatedActionsResponse.success) {
          setActions(
            updatedActionsResponse.data?.actions ||
              updatedActionsResponse.data ||
              []
          );
        }

        // Reset form dan tutup modal
        setActionForm({
          reportId: "",
          description: "",
          assignedTo: "",
          dueDate: "",
          priority: "medium",
        });
        setShowActionModal(false);

        // Refresh data untuk update statistik
        await loadData();

        alert("Tindakan berhasil dibuat!");
      } else {
        console.error("Failed to create action:", response.message);
        alert(
          "Gagal membuat tindakan: " + (response.message || "Terjadi kesalahan")
        );
      }
    } catch (error) {
      console.error("Error creating action:", error);
      alert("Terjadi kesalahan saat membuat tindakan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle assign report to officer
  const handleAssignReport = async (reportId) => {
    setIsLoading(true);
    try {
      // Ambil ID petugas dari localStorage atau context
      const officerId =
        localStorage.getItem("officerId") || "current-officer-id";

      console.log("Assigning report", reportId, "to officer", officerId);
      const response = await reportService.assignOfficer(reportId, {
        officerId,
      });

      if (response.success) {
        // Refresh reports list
        await loadData();
        alert("Laporan berhasil diambil!");
        setSelectedReport(null); // Tutup modal detail jika terbuka
      } else {
        console.error("Failed to assign report:", response.message);
        alert(
          "Gagal mengambil laporan: " +
            (response.message || "Terjadi kesalahan")
        );
      }
    } catch (error) {
      console.error("Error assigning report:", error);
      alert("Terjadi kesalahan saat mengambil laporan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update action status
  const handleUpdateActionStatus = async (actionId, newStatus) => {
    setIsLoading(true);
    try {
      const response = await actionService.updateAction(actionId, {
        status: newStatus,
      });

      if (response.success) {
        // Refresh actions list
        const updatedActionsResponse = await actionService.getAllActions();
        if (updatedActionsResponse.success) {
          setActions(
            updatedActionsResponse.data?.actions ||
              updatedActionsResponse.data ||
              []
          );
        }

        // Refresh stats
        await loadData();
        alert("Status tindakan berhasil diperbarui!");
      } else {
        console.error("Failed to update action:", response.message);
        alert("Gagal memperbarui status tindakan");
      }
    } catch (error) {
      console.error("Error updating action:", error);
      alert("Terjadi kesalahan saat memperbarui status tindakan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete action
  const handleDeleteAction = async (actionId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tindakan ini?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await actionService.deleteAction(actionId);

      if (response.success) {
        // Refresh actions list
        const updatedActionsResponse = await actionService.getAllActions();
        if (updatedActionsResponse.success) {
          setActions(
            updatedActionsResponse.data?.actions ||
              updatedActionsResponse.data ||
              []
          );
        }

        alert("Tindakan berhasil dihapus!");
      } else {
        console.error("Failed to delete action:", response.message);
        alert("Gagal menghapus tindakan");
      }
    } catch (error) {
      console.error("Error deleting action:", error);
      alert("Terjadi kesalahan saat menghapus tindakan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle action form change
  const handleActionFormChange = (field, value) => {
    setActionForm({
      ...actionForm,
      [field]: value,
    });
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Status and priority color helpers
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      onGoing: "bg-blue-100 text-blue-800 border-blue-200",
      ongoing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
    };
    return colors[priority] || "bg-gray-500";
  };

  // Format status text untuk display
  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Menunggu",
      onGoing: "Dikerjakan",
      ongoing: "Dikerjakan",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return statusTexts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-gradient-to-br from-indigo-200/20 to-blue-300/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-200/25 to-pink-300/25 rounded-full blur-xl"></div>
      </div>

      <div className="flex relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 ml-64">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
                <button
                  onClick={loadData}
                  className="text-red-600 hover:text-red-800 flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Coba Lagi
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 font-medium">Memuat data...</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === "dashboard" && (
                  <div className="space-y-8">
                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <StatCard
                          icon={Clock}
                          title="Menunggu"
                          value={stats.pending}
                          color="text-yellow-600"
                          trend="+2 hari ini"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <StatCard
                          icon={Activity}
                          title="Dikerjakan"
                          value={stats.onGoing}
                          color="text-blue-600"
                          trend="+3 hari ini"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <StatCard
                          icon={CheckCircle}
                          title="Selesai"
                          value={stats.completed}
                          color="text-green-600"
                          trend="+5 hari ini"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <StatCard
                          icon={XCircle}
                          title="Dibatalkan"
                          value={stats.cancelled}
                          color="text-red-600"
                        />
                      </div>
                    </div>

                    {/* Enhanced Recent Reports */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl"></div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 relative">
                        <div className="p-6 border-b border-gray-100/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <Activity className="h-5 w-5 text-white" />
                              </div>
                              <h2 className="text-xl font-bold text-gray-900">
                                Laporan Terbaru
                              </h2>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                                {reports.length} Total
                              </span>
                              <button
                                onClick={loadData}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Refresh Data"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {reports.slice(0, 3).map((report, index) => (
                              <div key={report.id} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                <div className="relative flex items-center justify-between p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100 group-hover:shadow-md transition-all duration-300">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className={`w-4 h-4 rounded-full ${getPriorityColor(
                                          report.priority
                                        )} shadow-sm`}
                                      ></div>
                                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                                        {index + 1}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">
                                        {report.title}
                                      </p>
                                      <p className="text-sm text-gray-500 flex items-center">
                                        📍 {report.location} • 👤{" "}
                                        {report.reporter?.name ||
                                          report.reporter}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-4 py-2 rounded-xl text-xs font-medium border shadow-sm ${getStatusColor(
                                      report.status
                                    )}`}
                                  >
                                    {getStatusText(report.status)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reports" && (
                  <div className="space-y-6">update:modify ReportCard to handle officer page
                    {/* Enhanced Filter Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                      <ReportsFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredReports.map((report) => (
                        <div key={report.id} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <ReportCard
                            report={report}
                            onView={setSelectedReport}
                            onAssign={handleAssignReport}
                            onAddAction={(report) => {
                              setActionForm({
                                ...actionForm,
                                reportId: report.id,
                              });
                              setShowActionModal(true);
                            }}
                            getStatusColor={getStatusColor}
                            getPriorityColor={getPriorityColor}
                            getStatusText={getStatusText}
                          />
                        </div>
                      ))}
                    </div>

                    {filteredReports.length === 0 && !isLoading && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Activity className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Tidak ada laporan ditemukan
                        </h3>
                        <p className="text-gray-500">
                          Coba ubah filter atau kata kunci pencarian
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "actions" && (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-blue-600/5 rounded-2xl"></div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 relative">
                        <div className="p-6 border-b border-gray-100/50 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                              Daftar Tindakan
                            </h2>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
                              {actions.length} Total
                            </span>
                            <button
                              onClick={() => setShowActionModal(true)}
                              className="group relative flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                              <Plus className="h-4 w-4 mr-2 relative z-10" />
                              <span className="relative z-10 font-medium">
                                Tambah Tindakan
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {actions.map((action, index) => (
                              <div key={action.id} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                <div className="relative border border-gray-200 rounded-xl p-5 bg-white/50 backdrop-blur-sm group-hover:shadow-lg transition-all duration-300">
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                                        {index + 1}
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                          {action.description}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                          👤 Ditugaskan ke:{" "}
                                          <span className="font-medium">
                                            {action.assignedTo}
                                          </span>
                                        </p>
                                        {action.reportId && (
                                          <p className="text-sm text-gray-500 mt-1">
                                            📋 Laporan:{" "}
                                            <span className="font-medium">
                                              {reports.find(
                                                (r) => r.id === action.reportId
                                              )?.title || action.reportId}
                                            </span>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                      <span
                                        className={`px-4 py-2 rounded-xl text-xs font-medium shadow-sm ${
                                          action.status === "planned"
                                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                            : action.status === "in_progress"
                                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                                            : "bg-green-100 text-green-800 border border-green-200"
                                        }`}
                                      >
                                        {action.status === "planned"
                                          ? "📋 Direncanakan"
                                          : action.status === "in_progress"
                                          ? "⚡ Sedang Dikerjakan"
                                          : "✅ Selesai"}
                                      </span>
                                    
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 flex items-center">
                                      🗓️ Tenggat:{" "}
                                      <span className="font-medium ml-1">
                                        {new Date(
                                          action.dueDate
                                        ).toLocaleDateString("id-ID")}
                                      </span>
                                    </span>
                                    <div className="flex space-x-3">
                                      {action.status !== "completed" && (
                                        <button
                                          onClick={() =>
                                            handleUpdateActionStatus(
                                              action.id,
                                              action.status === "planned"
                                                ? "in_progress"
                                                : "completed"
                                            )
                                          }
                                          className="px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 font-medium"
                                        >
                                          {action.status === "planned"
                                            ? "▶️ Mulai"
                                            : "✅ Selesai"}
                                        </button>
                                      )}
                                      <button
                                        onClick={() =>
                                          handleDeleteAction(action.id)
                                        }
                                        className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                                      >
                                        🗑️ Hapus
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {actions.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                              <div className="text-gray-400 mb-4">
                                <Target className="h-16 w-16 mx-auto" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Belum ada tindakan
                              </h3>
                              <p className="text-gray-500 mb-4">
                                Mulai dengan membuat tindakan baru untuk laporan
                              </p>
                              <button
                                onClick={() => setShowActionModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Tindakan Pertama
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>

          <ActionModal
            show={showActionModal}
            onClose={() => {
              setShowActionModal(false);
              setActionForm({
                reportId: "",
                description: "",
                assignedTo: "",
                dueDate: "",
                priority: "medium",
              });
            }}
            actionForm={actionForm}
            onFormChange={handleActionFormChange}
            onSubmit={handleCreateAction}
            reports={reports}
            isLoading={isLoading}
          />

          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onAssign={handleAssignReport}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getStatusText={getStatusText}
          />
        </div>
      </div>
    </div>
  );
};

export default OfficerPage;
