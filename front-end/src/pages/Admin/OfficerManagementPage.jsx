import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  Users,
  Activity,
  Droplets,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import reportService from "../../services/reportService";
import AddOfficerModal from "./AddOfficerModal";

// Mock service untuk demo - ganti dengan import asli Anda

const OfficerManagementPage = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const fetchOfficers = async () => {
    try {
      setLoading(true);
      const data = await userService.getOfficers();
      const officersData = Array.isArray(data) ? data : data.officers || [];
      setOfficers(officersData);
    } catch (err) {
      console.error("Error fetching officers:", err);
      setError(err.message || "Failed to load officers");
    } finally {
      setLoading(false);
    }
  };

  fetchOfficers();
}, []);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleMenuClick = (officerId, event) => {
    event.stopPropagation();
    setMenuOpen(menuOpen === officerId ? null : officerId);
  };

  const handleViewOfficer = (officerId) => {
    navigate(`/users/${officerId}`);
    setMenuOpen(null);
  };

  const handleEditOfficer = (officerId) => {
    navigate(`/officers/edit/${officerId}`);
    setMenuOpen(null);
  };

  const handleOfficerAdded = (newOfficer) => {
    setOfficers((prev) => [...prev, newOfficer]);
  };

  // Update handleAddOfficer untuk membuka modal
  const handleAddOfficer = () => {
    setIsAddModalOpen(true);
  };
  const handleDeleteClick = (officer) => {
    setOfficerToDelete(officer);
    setDeleteDialogOpen(true);
    setMenuOpen(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(officerToDelete.id);
      setOfficers(
        officers.filter(
          (officer) =>
            typeof officer.name === "string" &&
            officer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setDeleteDialogOpen(false);
      setOfficerToDelete(null);
    } catch (err) {
      console.error("Error deleting officer:", err);
      setError(err.message || "Failed to delete officer");
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const filteredOfficers = officers.filter((officer) => {
    const matchesSearch =
      officer.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      officer.email?.toLowerCase()?.includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && officer.active) ||
      (filterStatus === "inactive" && !officer.active);

    return matchesSearch && matchesFilter;
  });
  const activeOfficersCount = officers.filter((o) => o.active).length;
  const totalReports = officers.reduce(
    (sum, o) => sum + (o.assigned_reports_count || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading officers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <AddOfficerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onOfficerAdded={handleOfficerAdded}
      />
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Officer Management
                </h1>
                <p className="text-gray-600 text-sm">
                  PDAM Water Monitoring System
                </p>
              </div>
            </div>{" "}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={handleAddOfficer}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-200"
              >
                <UserPlus className="h-5 w-5" />
                <span>Add Officer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-100/50 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Officers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {officers.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-green-100/50 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Active Officers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {activeOfficersCount}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-cyan-100/50 border border-cyan-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Assigned Reports
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalReports}
                </p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-xl">
                <Activity className="h-8 w-8 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-100/50 border border-blue-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search officers..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filterStatus === "all"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filterStatus === "active"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleFilterChange("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filterStatus === "inactive"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  Inactive
                </button>
              </div>

              <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Officers Table */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Officer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Assigned Reports
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOfficers.map((officer) => (
                  <tr
                    key={officer.id}
                    className="hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleViewOfficer(officer.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {officer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {officer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {officer.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {officer.email}
                        </p>
                        <p className="text-sm text-gray-600">{officer.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {officer.assigned_reports_count || 0}
                        </span>
                        <span className="text-sm text-gray-500">reports</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {officer.active ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                              Inactive
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={(e) => handleMenuClick(officer.id, e)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {menuOpen === officer.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOfficer(officer.id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOfficer(officer.id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                            >
                              <Edit3 className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(officer);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOfficers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No officers found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete officer{" "}
                <strong>{officerToDelete?.name}</strong>? This action cannot be
                undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setOfficerToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click away to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
};

export default OfficerManagementPage;
