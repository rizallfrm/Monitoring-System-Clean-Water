import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  ClipboardList,
  CheckSquare,
  Loader,
  Search,
  User,
  Filter,
  Plus,
} from "lucide-react";

// API services
const API_URL =import.meta.env.REACT_API_URL || "http://localhost:5000/api";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const reportApi = {
  getAssignedReports: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters,
    });
    return fetchWithAuth(`/reports?${queryParams}`);
  },
  getReportById: (id) => fetchWithAuth(`/reports/${id}`),
  completeReport: (id) =>
    fetchWithAuth(`/reports/${id}/complete`, {
      method: "POST",
    }),
};

const actionApi = {
  getActionsByReportId: (reportId) =>
    fetchWithAuth(`/reports/${reportId}/actions`),
  createAction: (reportId, actionDescription) =>
    fetchWithAuth("/actions", {
      method: "POST",
      body: JSON.stringify({
        reportId,
        actionDescription,
      }),
    }),
  updateAction: (id, actionDescription) =>
    fetchWithAuth(`/actions/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        actionDescription,
      }),
    }),
};

// Dashboard component
export default function PetugasDashboard() {
  const [activeTab, setActiveTab] = useState("assigned");
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportActions, setReportActions] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionDescription, setActionDescription] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [currentPage, filters, activeTab]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // For assigned reports, we need to filter by assigned_to
      const apiFilters = { ...filters };
      if (activeTab === "assigned") {
        apiFilters.assignedTo = localStorage.getItem("userId");
      }

      const response = await reportApi.getAssignedReports(
        currentPage,
        10,
        apiFilters
      );
      setReports(response.data.reports);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      showNotification("Error: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setFilters({ ...filters, search: e.target.value });
      setCurrentPage(1);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, status: e.target.value });
    setCurrentPage(1);
  };

  const openDetailModal = async (report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);

    try {
      const actionsResponse = await actionApi.getActionsByReportId(
        report.report_id
      );
      setReportActions(actionsResponse.data);
    } catch (error) {
      showNotification("Error fetching actions: " + error.message, "error");
    }
  };

  const openActionModal = (report) => {
    setSelectedReport(report);
    setActionDescription("");
    setIsActionModalOpen(true);
  };

  const handleAddAction = async () => {
    if (!actionDescription.trim()) {
      showNotification("Deskripsi tindakan tidak boleh kosong", "error");
      return;
    }

    try {
      await actionApi.createAction(selectedReport.report_id, actionDescription);
      showNotification("Tindakan berhasil ditambahkan");
      setIsActionModalOpen(false);

      // Refresh actions for current report if detail modal is open
      if (isDetailModalOpen) {
        const actionsResponse = await actionApi.getActionsByReportId(
          selectedReport.report_id
        );
        setReportActions(actionsResponse.data);
      }

      // Refresh reports list
      fetchReports();
    } catch (error) {
      showNotification("Error: " + error.message, "error");
    }
  };

  const handleCompleteReport = async (reportId) => {
    try {
      await reportApi.completeReport(reportId);
      showNotification("Laporan berhasil diselesaikan");

      // Update report status in the list
      const updatedReports = reports.map((report) =>
        report.report_id === reportId
          ? { ...report, status: "Completed" }
          : report
      );
      setReports(updatedReports);

      // Close modals
      setIsDetailModalOpen(false);
    } catch (error) {
      showNotification("Error: " + error.message, "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "On-Going":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancel":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard Petugas
          </h1>
          <div className="flex items-center space-x-4">
            <button className="rounded-full bg-gray-100 p-2">
              <Bell size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Petugas
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("assigned")}
              className={`${
                activeTab === "assigned"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Laporan Ditugaskan
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Semua Laporan
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari laporan..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
              onKeyPress={handleSearch}
            />
            <Search
              size={20}
              className="text-gray-400 absolute left-3 top-2.5"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Filter size={20} className="text-gray-500" />
            <select
              onChange={handleFilterChange}
              value={filters.status}
              className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="On-Going">On-Going</option>
              <option value="Completed">Completed</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelapor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <Loader className="animate-spin inline mr-2" /> Memuat
                    data...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada laporan yang ditemukan.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.report_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {report.report_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {report.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openDetailModal(report)}
                        className="text-blue-600 hover:underline"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => openActionModal(report)}
                        className="text-green-600 hover:underline"
                      >
                        Tambah Tindakan
                      </button>
                      {report.status !== "Completed" && (
                        <button
                          onClick={() => handleCompleteReport(report.report_id)}
                          className="text-indigo-600 hover:underline"
                        >
                          Selesaikan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Halaman <span className="font-medium">{currentPage}</span> dari{" "}
            <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md`}
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md`}
            >
              Berikutnya
            </button>
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white transition-all duration-300 ease-in-out`}
        >
          {notification.message}
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detail Laporan #{selectedReport.report_id}
                </h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="md:w-1/2">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Deskripsi
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedReport.description}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Lokasi
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedReport.location}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Status
                    </h4>
                    <span
                      className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                        selectedReport.status
                      )}`}
                    >
                      {selectedReport.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Pelapor
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedReport.reporter?.name || "-"}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Tanggal Laporan
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedReport.created_at).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Riwayat Tindakan
                  </h4>
                  {reportActions.length === 0 ? (
                    <p className="text-sm text-gray-500">Belum ada tindakan</p>
                  ) : (
                    <div className="space-y-3">
                      {reportActions.map((action) => (
                        <div
                          key={action.action_id}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(action.performed_at).toLocaleString(
                                "id-ID"
                              )}
                            </span>
                            <span className="text-xs font-medium text-blue-600">
                              {action.performer?.name || "-"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">
                            {action.action_description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t flex justify-end">
              {selectedReport.status !== "Completed" &&
                selectedReport.status !== "Cancel" && (
                  <>
                    <button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        openActionModal(selectedReport);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 mr-3"
                    >
                      Tambah Tindakan
                    </button>
                    <button
                      onClick={() =>
                        handleCompleteReport(selectedReport.report_id)
                      }
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                    >
                      Selesaikan Laporan
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Add Action Modal */}
      {isActionModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tambah Tindakan
                </h3>
                <button
                  onClick={() => setIsActionModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Tindakan
                </label>
                <textarea
                  value={actionDescription}
                  onChange={(e) => setActionDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Masukkan deskripsi tindakan yang dilakukan..."
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-3 border-t flex justify-end">
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAction}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
