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
import Navbar from "../../components/Navbar";

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
  const [reportsCount, setReportsCount] = useState({});
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

  // Tutup menu saat klik di luar
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
    // Tutup menu jika sudah terbuka, buka yang baru jika berbeda
    setMenuOpen((prev) => (prev === officerId ? null : officerId));
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
      await userService.deleteUser(officerToDelete.user_id);
      // Update state officers
      setOfficers(officers.filter((o) => o.id !== officerToDelete.user_id));

      // Tampilkan alert sukses
      alert(`Officer "${officerToDelete.name}" berhasil dihapus!`);

      // Tutup modal dan reset state
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
      />            <Navbar/>

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

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOfficers.map((officer) => (
                  <tr
                    key={officer.user_id}
                    className="hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleViewOfficer(officer.user_id)}
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

                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={(e) => handleMenuClick(officer.user_id, e)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {menuOpen === officer.user_id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOfficer(officer.user_id);
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
               
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus dari akun petugas{" "}
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

      {/* Click away to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
};

export default OfficerManagementPage;
