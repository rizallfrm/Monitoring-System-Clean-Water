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
  User,
  ChevronDown,
  X,
  MapPin,
  Calendar,
  Clock,
  Badge,
  Phone,
  Mail,
  UserCheck,
  FileText,
  TrendingUp,
  Award,
  Shield,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import reportService from "../../services/reportService";
import AddOfficerModal from "./AddOfficerModal";
import Navbar from "../../components/Navbar";
import Footer from "../../components/LandingPage/Footer";

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
  const [reportsCount, setReportsCount] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleMenuClick = (officerId, event) => {
    event.stopPropagation();
    setMenuOpen((prev) => (prev === officerId ? null : officerId));
  };

  const handleViewOfficer = (officerId, event) => {
    event?.stopPropagation();
    const officer = officers.find((o) => o.user_id === officerId);
    setSelectedOfficer(officer);
    setShowProfileModal(true);
    setMenuOpen(null);
  };

  const handleEditOfficer = (officerId, event) => {
    event?.stopPropagation();
    navigate(`/officers/edit/${officerId}`);
    setMenuOpen(null);
  };

  const handleOfficerAdded = (newOfficer) => {
    setOfficers((prev) => [...prev, newOfficer]);
  };

  const handleAddOfficer = () => {
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (officer, event) => {
    event?.stopPropagation();
    setOfficerToDelete(officer);
    setDeleteDialogOpen(true);
    setMenuOpen(null);
    setShowProfileModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(officerToDelete.user_id);
      setOfficers(
        officers.filter((o) => o.user_id !== officerToDelete.user_id)
      );
      alert(`Officer "${officerToDelete.name}" berhasil dihapus!`);
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

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Function to calculate days since last login
  const getDaysSinceLastLogin = (lastLogin) => {
    if (!lastLogin) return null;
    const today = new Date();
    const loginDate = new Date(lastLogin);
    const diffTime = Math.abs(today - loginDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to get performance rating
  const getPerformanceRating = (reportsCount) => {
    if (reportsCount >= 50)
      return {
        rating: "Excellent",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    if (reportsCount >= 30)
      return { rating: "Good", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (reportsCount >= 15)
      return {
        rating: "Average",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    return {
      rating: "Needs Improvement",
      color: "text-red-600",
      bgColor: "bg-red-100",
    };
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
    <>
      {" "}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <AddOfficerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onOfficerAdded={handleOfficerAdded}
        />
        <Navbar />
        <div className="mb-8 px-80 pt-8">
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
                        User Management
                      </h1>
                      <p className="text-blue-100 mt-2 ">
                        Kelola dan pantau semua petugas yang terdaftar dalam
                        sistem secara realtime. Berikan akses tepat, pantau
                        aktivitas, dan optimalkan pengalaman
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search and Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-100/50 border border-blue-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search petugas..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAddOfficer}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-200"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Tambah Petugas</span>
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
                      Petugas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOfficers.map((officer) => (
                    <tr
                      key={officer.user_id}
                      className="hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer"
                      onClick={(e) => handleViewOfficer(officer.user_id, e)}
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
                          <p className="text-sm text-gray-600">
                            {officer.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right"></td>
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
                  Konfirmasi Penghapusan
                </h3>
                <p className="text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus petugas{" "}
                  <strong>{officerToDelete?.name}</strong>?
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

        {/* Enhanced Officer Profile Modal */}
        {showProfileModal && selectedOfficer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profil Petugas
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Informasi lengkap dan statistik petugas
                    </p>
                  </div>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Officer Profile Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-20"></div>
                        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-4">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedOfficer.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-medium text-blue-600 capitalize">
                            {selectedOfficer.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <span>Informasi Kontak</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Email
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedOfficer.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Telepon
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedOfficer.phone || "Tidak ada"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <span>Informasi Akun</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Tanggal Bergabung
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(selectedOfficer.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <UserCheck className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            ID Petugas
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            #{selectedOfficer.user_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-200 pt-6 flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(selectedOfficer, e);
                      }}
                      className="flex-1 rounded-lg border border-red-500 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Hapus Akun</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Click away to close menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(null)}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default OfficerManagementPage;
