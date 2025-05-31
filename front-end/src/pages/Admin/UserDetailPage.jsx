import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Activity,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Droplets
} from 'lucide-react';

// Mock services untuk demo - ganti dengan import asli Anda
const userService = {
  getUserById: async (id) => ({ 
    id: 1, 
    name: 'John Doe', 
    email: 'john@pdam.com', 
    phone: '081234567890', 
    role: 'Petugas', 
    active: true 
  }),
  updateUser: async (id, data) => data,
  deleteUser: async (id) => ({ success: true })
};

const reportService = {
  getAllReports: async (params) => [
    { id: 1, title: 'Water Quality Report - Sector A', status: 'completed', created_at: '2024-01-15' },
    { id: 2, title: 'Pressure Test - Sector B', status: 'pending', created_at: '2024-01-14' }
  ]
};

const UserDetailPage = () => {
  // Mock params dan navigate untuk demo
  const id = '1';
  const navigate = (path) => console.log('Navigate to:', path);
  
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [activeTab, setActiveTab] = useState('reports');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userData, userReports] = await Promise.all([
          userService.getUserById(id),
          reportService.getAllReports({ userId: id }),
        ]);
        
        setUser(userData);
        setEditedUser(userData);
        setReports(userReports);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleBackClick = () => {
    navigate('/users');
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedUser(user);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(id, editedUser);
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(id);
      navigate('/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading user details...</p>
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-yellow-500 mr-3" />
            <p className="text-yellow-700 font-medium">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    User Profile
                  </h1>
                  <p className="text-gray-600 text-sm">PDAM Water Monitoring System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <span className="text-3xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {!editMode ? (
                    <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                  ) : (
                    <input
                      type="text"
                      name="name"
                      value={editedUser.name || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 text-center text-xl font-bold"
                      placeholder="User Name"
                    />
                  )}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{user.role}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Email */}
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                    {!editMode ? (
                      <p className="text-gray-900">{user.email}</p>
                    ) : (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email || ''}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="Email address"
                      />
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
                    {!editMode ? (
                      <p className="text-gray-900">{user.phone || '-'}</p>
                    ) : (
                      <input
                        type="text"
                        name="phone"
                        value={editedUser.phone || ''}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="Phone number"
                      />
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start space-x-3">
                  <Activity className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                    {!editMode ? (
                      <div className="flex items-center space-x-2">
                        {user.active ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ) : (
                      <select
                        name="active"
                        value={editedUser.active ? 'true' : 'false'}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, active: e.target.value === 'true' }))}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100">
                  {!editMode ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleEditClick}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteDialogOpen(true)}
                        className="px-4 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveEdit}
                        disabled={loading}
                        className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'reports' 
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Reports ({reports.length})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'activity' 
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Activity</span>
                    </div>
                  </button>
                  {user.role === 'Petugas' && (
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                        activeTab === 'tasks' 
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Assigned Tasks</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'reports' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Water Quality Reports</h3>
                    {reports.length > 0 ? (
                      <div className="space-y-4">
                        {reports.map((report) => (
                          <div key={report.id} className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                    {report.status}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => navigate(`/reports/${report.id}`)}
                                className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No reports submitted by this user</p>
                        <p className="text-gray-400 text-sm">Water quality reports will appear here</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Activity Log</p>
                    <p className="text-gray-400 text-sm">User activity history will be displayed here</p>
                  </div>
                )}

                {activeTab === 'tasks' && user.role === 'Petugas' && (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Assigned Tasks</p>
                    <p className="text-gray-400 text-sm">Water monitoring tasks will be displayed here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
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
    </div>
  );
};

export default UserDetailPage;