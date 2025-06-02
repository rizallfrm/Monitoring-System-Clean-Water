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
import authService from "../services/authService";
import userService from "../services/userService";
import ActionsList from "../components/Officers/ActionList";
import ActionList from "../components/Officers/ActionList";

const OfficerPage = (response) => {
  const [activeTab, setActiveTab] = useState("actions");
  const [reports, setReports] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]); // Tambahkan state untuk riwayat status
  const [status, setStatus] = useState({
    pending: 0,
    onGoing: 0,
    completed: 0,
    cancelled: 0,
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentOfficerId, setCurrentOfficerId] = useState(null);
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [actionForm, setActionForm] = useState({
    reportId: "",
    actionDescription: "",
    dueDate: "",
  });
  const [statusForm, setStatusForm] = useState({
    reportId: "",
    status: "On-Going",
  });
  const [actions, setActions] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [actionsError, setActionsError] = useState(null);
  const [currentReportId, setCurrentReportId] = useState(5); // Ganti dengan ID report yang sesuai

  const loadCurrentOfficer = async () => {
    try {
      const officerData = await userService.getProfile();
      setCurrentOfficer({
        id: officerData.data?.user_id,
        name: officerData.data?.name,
        email: officerData.data?.email,
      });
    } catch (error) {
      console.error("Gagal memuat data petugas:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "actions") {
    }
  }, [activeTab, currentOfficerId]);
  const handleReportClick = (report) => {
    console.log("Selected report:", report); // Check if report exists and has report_id
    setSelectedReport(report);
  };
  const loadActionsForReportWithDebug = async (reportId) => {
    console.log("Loading actions for report ID:", reportId);
    setIsLoadingActions(true);
    setActionsError(null);
    try {
      const response = await actionService.getActionsByReportId(reportId);
      console.log("Response dari API:", response);

      if (response.status === "success") {
        console.log("Response data:", response.data);
        console.log("Is array?", Array.isArray(response.data));

        const actionsData = Array.isArray(response.data) ? response.data : [];
        console.log("Actions data to set:", actionsData);

        setActions(actionsData);
        setSelectedReportId(reportId);
      } else {
        throw new Error(response.message || "Gagal memuat tindakan");
      }
    } catch (error) {
      console.error("Gagal memuat tindakan:", error);
      setActionsError(error.message);
      setActions([]);
    } finally {
      setIsLoadingActions(false);
    }
  };

  // 4. TAMBAHKAN BUTTON DI REPORT CARD UNTUK LOAD ACTIONS
  const handleViewActionsFromReport = (reportId) => {
    console.log("View actions for report:", reportId);
    setSelectedReportId(reportId);
    loadActionsForReport(reportId);
    setActiveTab("actions"); // Switch to actions tab
  };

  useEffect(() => {
    loadData();
    loadCurrentOfficer();
  }, []);
  // useEffect(() => {
  //   if (activeTab === "actions") {
  //     // Memuat semua tindakan untuk petugas ini
  //     const loadAllActions = async () => {
  //       try {
  //         const response = await actionService.getActionsByOfficer(
  //           currentOfficerId
  //         );
  //         setActions(response.data || []);
  //       } catch (error) {
  //         console.error("Gagal memuat tindakan:", error);
  //         setActions([]);
  //       }
  //     };

  //     loadAllActions();
  //   }
  // }, [activeTab, currentOfficerId]);
  // Load data from API
  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ambil officerId dari user yang login
      const userData = await authService.getProfile();
      setCurrentOfficerId(userData.user_id);

      // Load reports yang ditugaskan ke officer ini
      try {
        const reportsResponse = await reportService.getReportsByOfficer(
          userData.user_id
        );
        setReports(reportsResponse.data?.reports || []);
      } catch (reportError) {
        setError(`Gagal memuat laporan: ${reportError.message}`);
        setReports([]);
      }

      // // Load actions untuk officer ini
      // try {
      //   const actionsResponse = await actionService.getActionsByOfficer(
      //     userData.id
      //   );
      //   setActions(actionsResponse.data?.actions || []);
      // } catch (actionError) {
      //   console.error("Actions loading failed:", actionError);
      //   setActions([]);
      // }

      // Load statistics untuk officer ini
      // try {
      //   const statsResponse = await statusService.getOfficerStatistics(
      //     userData.user_id
      //   );
      //   setStats({
      //     pending: parseInt(statsResponse.data?.pending || 0),
      //     onGoing: parseInt(statsResponse.data?.onGoing || 0),
      //     completed: parseInt(statsResponse.data?.completed || 0),
      //     cancelled: parseInt(statsResponse.data?.cancelled || 0),
      //   });
      // } catch (statsError) {
      //   console.error("Stats loading failed:", statsError);
      //   setStats({ pending: 0, onGoing: 0, completed: 0, cancelled: 0 });
      // }
    } catch (error) {
      console.error("Critical error in loadData:", error);
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadActionsForReport = async (reportId) => {
    setIsLoadingActions(true);
    setActionsError(null);
    try {
      const response = await actionService.getActionsByReportId(reportId);
      console.log("Response dari API:", response);
      if (response.status === "success") {
        setActions(Array.isArray(response.data) ? response.data : []);
        setSelectedReportId(reportId);
      } else {
        throw new Error(response.message || "Gagal memuat tindakan");
      }
    } catch (error) {
      console.error("Gagal memuat tindakan:", error);
      setActionsError(error.message);
      setActions([]);
    } finally {
      setIsLoadingActions(false);
    }
  };
  const handleViewActions = (reportId) => {
    setSelectedReportId(reportId);
    loadActionsForReport(reportId);
    setActiveTab("actions"); // Switch to actions tab
  };
  // Handle create new action dengan validasi yang lebih baik
  const handleCreateAction = async () => {
    // Validasi
    if (!actionForm.reportId || !actionForm.actionDescription) {
      alert("ID laporan dan deskripsi tindakan harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const actionData = {
        reportId: actionForm.reportId,
        actionDescription: actionForm.actionDescription, // Pastikan nama field sesuai
        // Jika backend membutuhkan performed_by (ID petugas)
        performed_by: currentOfficer.user_id || currentOfficer.id,
      };

      const response = await actionService.createAction(actionData);

      if (response.status === "success") {
        await loadData();
        setShowActionModal(false);
        setActionForm({
          reportId: "",
          actionDescription: "", // Sesuaikan dengan nama field
          dueDate: "",
        });
        alert("Tindakan berhasil ditambahkan!");
      } else {
        throw new Error(response.message || "Gagal membuat tindakan");
      }
    } catch (error) {
      console.error("Error creating action:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateStatus = async (reportId, newStatus) => {
    setIsLoading(true);
    try {
      const response = await statusService.createStatusUpdate({
        reportId: reportId, // Use the reportId passed from the modal
        status: newStatus, // Use the newStatus passed from the modal
      });

      if (response.status === "success") {
        // Refresh data
        await loadData();
        setSelectedReport(null); // Close the modal
        toast.success("Status berhasil diperbarui!");
      } else {
        throw new Error(response.message || "Gagal memperbarui status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        "Terjadi kesalahan saat memperbarui status: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load status history untuk laporan tertentu
  const loadStatusHistory = async (reportId) => {
    try {
      const response = await statusService.getStatusHistoryByReportId(reportId);
      setStatusHistory(response.data || []);
      setCurrentStatus(response.data[0]?.status || "Pending");
    } catch (error) {
      console.error("Error loading status history:", error);
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
      // Sesuaikan dengan status yang diterima backend
      const statusMap = {
        planned: "On-Going",
        in_progress: "Completed",
        completed: "Completed",
      };

      const response = await actionService.updateAction(actionId, {
        status: statusMap[newStatus] || newStatus,
      });

      if (response.status === "success") {
        // Update state secara manual
        setActions((prevActions) =>
          prevActions.map((action) =>
            action.action_id === actionId
              ? { ...action, status: response.data.status }
              : action
          )
        );
        toast.success("Status berhasil diperbarui!");
      }
    } catch (error) {
      toast.error("Gagal memperbarui status: " + error.message);
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

      if (response.status === "success") {
        // Ubah dari response.success ke response.status
        // Refresh actions list
        const updatedActionsResponse = await actionService.getActionsByReportId(
          selectedReportId
        ); // Lebih baik gunakan ini daripada getAllActions
        if (updatedActionsResponse.status === "success") {
          setActions(updatedActionsResponse.data || []);
        }

        alert("Tindakan berhasil dihapus!");
      } else {
        console.error("Failed to delete action:", response.message);
        alert(response.message || "Gagal menghapus tindakan");
      }
    } catch (error) {
      console.error("Error deleting action:", error);
      alert(error.message || "Terjadi kesalahan saat menghapus tindakan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle action form change
  const handleActionFormChange = (field, value) => {
    setActionForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    // Pastikan report ditugaskan ke officer yang login
    const isAssignedToMe = report.assigned_to === currentOfficerId;

    const matchesSearch =
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || report.status === filterStatus;

    return isAssignedToMe && matchesSearch && matchesFilter;
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
                          value={status.pending}
                          color="text-yellow-600"
                          trend="+2 hari ini"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <StatCard
                          icon={Activity}
                          title="Dikerjakan"
                          value={status.onGoing}
                          color="text-blue-600"
                          trend="+3 hari ini"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <StatCard
                          icon={CheckCircle}
                          title="Selesai"
                          value={status.completed}
                          color="text-green-600"
                          trend="+5 hari ini"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <StatCard
                          icon={XCircle}
                          title="Dibatalkan"
                          value={status.cancelled}
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
                              <div
                                key={report.report_id}
                                className="group relative"
                              >
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
                  <div className="space-y-6">
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
                        <div key={report.report_id} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <ReportCard
                            report={report}
                            onView={setSelectedReport}
                            onAssign={handleAssignReport}
                            onAddAction={(report) => {
                              setActionForm({
                                ...actionForm,
                                reportId: report.report_id,
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
                            {/* Dropdown untuk memilih report */}
                            <select
                              value={selectedReportId || ""}
                              onChange={(e) => {
                                const reportId = e.target.value;
                                if (reportId) {
                                  loadActionsForReport(parseInt(reportId));
                                } else {
                                  setActions([]);
                                  setSelectedReportId(null);
                                }
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="">Pilih Laporan</option>
                              {reports.map((report) => (
                                <option
                                  key={report.report_id}
                                  value={report.report_id}
                                >
                                  #{report.report_id} - {report.title}
                                </option>
                              ))}
                            </select>

                            <span className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
                              {actions.length} Total
                            </span>
                            <button
                              onClick={() => {
                                setActionForm({
                                  reportId: selectedReportId || "",
                                  actionDescription: "",
                                });
                                setShowActionModal(true);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                              disabled={!selectedReportId}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah Tindakan
                            </button>
                          </div>
                        </div>

                        <div className="p-6">
                          {isLoadingActions ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                            </div>
                          ) : actionsError ? (
                            <div className="text-red-500 text-center py-4">
                              {actionsError}
                              <button
                                onClick={() =>
                                  loadActionsForReport(selectedReportId)
                                }
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                Coba Lagi
                              </button>
                            </div>
                          ) : actions.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="text-gray-400 mb-4">
                                <Target className="h-16 w-16 mx-auto" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Pilih Laporan Terlebih Dahulu
                              </h3>
                              <p className="text-gray-500 pb-6">
                                Gunakan dropdown di atas untuk memilih laporan
                                dan melihat tindakannya
                              </p>
                              <button
                                onClick={() => setShowActionModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Tindakan Pertama
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {actions.map((action) => {
                                const report = reports.find(
                                  (r) => r.report_id === action.report_id
                                );
                                return (
                                  <div
                                    key={action.action_id}
                                    className="group relative"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    <div className="relative border border-gray-200 rounded-xl p-5 bg-white/50 backdrop-blur-sm group-hover:shadow-lg transition-all duration-300">
                                      <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start space-x-3 flex-1">
                                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                                            {action.action_id}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-lg truncate">
                                              {action.action_description}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                              <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                  Laporan:
                                                </span>{" "}
                                                <span className="truncate">
                                                  {report?.title ||
                                                    `#${action.report_id}`}
                                                </span>
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                  Petugas:
                                                </span>{" "}
                                                {action.performer?.name ||
                                                  "Tidak diketahui"}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                  Tanggal:
                                                </span>{" "}
                                                {new Date(
                                                  action.performed_at
                                                ).toLocaleDateString("id-ID")}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                  Status:
                                                </span>{" "}
                                                <span
                                                  className={`px-2 py-4 text-xs font-medium${getStatusColor(
                                                    report.status
                                                  )}`}
                                                >
                                                  {getStatusText(report.status)}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() => {
                                              setSelectedReport(report);
                                              loadStatusHistory(
                                                action.report_id
                                              );
                                            }}
                                            className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
                                          >
                                            Lihat Laporan
                                          </button>
                                        </div>
                                        <div className="flex space-x-2">
                                          
                                          <button
                                            onClick={() =>
                                              handleDeleteAction(
                                                action.action_id
                                              )
                                            }
                                            className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm"
                                          >
                                            Hapus
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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
            onClose={() => setShowActionModal(false)}
            actionForm={actionForm}
            onFormChange={handleActionFormChange}
            onSubmit={handleCreateAction}
            reports={reports}
            isLoading={isLoading}
            currentOfficer={currentOfficer} // Kirim data petugas
          />
          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onAssign={handleAssignReport}
            onUpdateStatus={handleUpdateStatus} // Pass the updated handler
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getStatusText={getStatusText}
          />
        </div>
      </div>
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Status Laporan</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Status Saat Ini
              </label>
              <div className="p-2 bg-gray-100 rounded">{currentStatus}</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Status Baru
              </label>
              <select
                value={statusForm.status}
                onChange={(e) =>
                  setStatusForm({ ...statusForm, status: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="On-Going">On-Going</option>
                <option value="Completed">Completed</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Riwayat Status
              </label>
              <div className="max-h-40 overflow-y-auto">
                {statusHistory.map((status, index) => (
                  <div key={index} className="p-2 border-b">
                    <p>
                      {status.status} -{" "}
                      {new Date(status.updated_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Oleh: {status.updater?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerPage;
