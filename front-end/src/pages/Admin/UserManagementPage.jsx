import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  UserPlus,
  AlertCircle,
  Shield,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import userService from "../../services/userService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/LandingPage/Footer";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Warga",
  });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDropdownToggle = (userId) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const handleViewUser = (userId) => {
    // Navigate to user details
    console.log("View user:", userId);
    setActiveDropdown(null);
  };

  const handleUpdateUser = async () => {
    setLoading(true);

    try {
      // Your existing API integration for updateUser
      const response = await userService.updateUser(editingUser.user_id, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      });

      if (response.ok) {
        // Update local state
        setUsers(
          users.map((user) =>
            user.user_id === editingUser.user_id
              ? { ...user, ...formData }
              : user
          )
        );
        setShowEditModal(false);
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "warga",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userId) => {
    const selectedUser = users.find((u) => u.user_id === userId);
    if (!selectedUser) return;

    setUserToEdit(selectedUser);
    setEditUser(selectedUser); // Tambahkan ini
    setEditFormData({
      name: selectedUser.name,
      email: selectedUser.email,
      password: "", // Kosongkan karena opsional
      phone: selectedUser.phone || "",
      role: selectedUser.role,
    });
    setEditDialogOpen(true);
    setActiveDropdown(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userToEdit || !userToEdit.user_id) {
        throw new Error("User data is incomplete");
      }

      // Siapkan data untuk dikirim ke backend
      const payload = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        role: editFormData.role,
      };

      // Hanya kirim password jika diisi
      if (editFormData.password) {
        payload.password = editFormData.password;
      }

      await userService.updateUser(userToEdit.user_id, payload);

      // Update state
      const updatedUsers = users.map((u) =>
        u.user_id === userToEdit.user_id ? { ...u, ...payload } : u
      );

      setUsers(updatedUsers);
      setEditDialogOpen(false);
      setUserToEdit(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err.message || "Gagal update user");
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(userToDelete?.user_id);
      console.log("Deleting user:", userToDelete);

      setUsers(users.filter((user) => user.user_id !== userToDelete.user_id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const UserCard = ({ user }) => (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="mt-1 flex items-center space-x-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.role === "Admin"
                    ? "bg-purple-100 text-purple-800"
                    : user.role === "Petugas"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.role}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.phone}`}
              >
                {user.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation(); // MENCEGAH event bubbling
              handleDropdownToggle(user.user_id);
            }}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {activeDropdown === user.user_id && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-200">
              <button
                onClick={() => handleEditUser(user.user_id)}
                className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteClick(user)}
                className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <Navbar />
        <div className="mx-auto max-w-7xl pt-6">
          {/* Header */}
          <div className="mb-8 ">
            <div className="relative  overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-xl">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-600/10"></div>
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <div className="mb-4">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Kembali ke Halaman Sebelumnya
                </button>
              </div>
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
                          Kelola dan pantau semua user yang terdaftar dalam
                          sistem. Berikan akses tepat, pantau aktivitas, dan
                          optimalkan pengalaman
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

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Petugas">Petugas</option>
                  <option value="Warga">Warga</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <UserCard key={user.user_id} user={user} />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first user"}
              </p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Confirm Delete
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700">
                  Are you sure you want to delete user{" "}
                  <strong>{userToDelete?.name}</strong>?
                </p>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {activeDropdown && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setActiveDropdown(null)}
          ></div>
        )}
        {editDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Edit User
              </h2>
              <div className="space-y-4">
                <input
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  placeholder="Name"
                  className="w-full rounded border px-4 py-2"
                />
                <input
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  placeholder="Email"
                  className="w-full rounded border px-4 py-2"
                />
                <input
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditInputChange}
                  placeholder="Phone"
                  className="w-full rounded border px-4 py-2"
                />
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditInputChange}
                  className="w-full rounded border px-4 py-2"
                >
                  <option value="Admin">Admin</option>
                  <option value="Petugas">Petugas</option>
                  <option value="Warga">Warga</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setEditDialogOpen(false)}
                  className="rounded bg-gray-100 px-4 py-2 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>{" "}
      <Footer />
    </>
  );
};

export default UserManagementPage;
