"use client";
import { useAuth } from "../Context/authContext";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {api} from '../services/apiService';

export default function UserPage() {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const router = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [newStatus, setNewStatus] = useState('');
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const reportsData = await api.getAllReports();
        setReports(reportsData);
        
        // Set initial form data from user context
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        });
      } catch (error) {
        toast.error('Failed to load data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router, user]);

  const fetchStatusHistory = async (reportId) => {
    try {
      const data = await api.getStatusHistoryByReportId(reportId);
      setStatusHistory(data);
    } catch (error) {
      toast.error('Failed to fetch status history: ' + error.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile: ' + error.message);
    }
  };

  const handleCreateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.createStatusUpdate({
        reportId: selectedReport.id,
        status: newStatus,
        notes: ''
      });
      setNewStatus('');
      fetchStatusHistory(selectedReport.id);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status: ' + error.message);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      await api.createReport(newReport);
      setNewReport({
        title: '',
        description: '',
        category: ''
      });
      const updatedReports = await api.getAllReports();
      setReports(updatedReports);
      setActiveTab('reports');
      toast.success('Report created successfully');
    } catch (error) {
      toast.error('Failed to create report: ' + error.message);
    }
  };

  const handleCancelReport = async (reportId) => {
    try {
      await api.cancelReport(reportId);
      const updatedReports = await api.getAllReports();
      setReports(updatedReports);
      toast.success('Report cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel report: ' + error.message);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name || 'User'}!</p>
          </div>
          <button 
            onClick={logout} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'reports' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                My Reports
              </button>
              <button
                onClick={() => setActiveTab('new-report')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'new-report' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                New Report
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || ''
                          });
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xl font-medium">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{user.name || 'Not provided'}</h3>
                        <p className="text-sm text-gray-500">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Reports</h2>
                
                {reports.length === 0 ? (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-3 text-gray-500">You haven't submitted any reports yet.</p>
                    <button
                      onClick={() => setActiveTab('new-report')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create New Report
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reports.map((report) => (
                      <div key={report.id} className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
                        <div 
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedReport(selectedReport?.id === report.id ? null : report);
                            if (selectedReport?.id !== report.id) {
                              fetchStatusHistory(report.id);
                            }
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                              <p className="text-sm text-gray-500 mt-1 capitalize">{report.category}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              report.status === 'completed' ? 'bg-green-100 text-green-800' :
                              report.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {report.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                            <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {selectedReport?.id === report.id ? 'Hide details' : 'View details'}
                            </span>
                          </div>
                        </div>

                        {selectedReport?.id === report.id && (
                          <div className="border-t p-4 bg-gray-50">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Status History
                            </h4>
                            <div className="space-y-4">
                              {statusHistory.length > 0 ? (
                                <div className="relative">
                                  {/* Timeline */}
                                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                  {statusHistory.map((status, idx) => (
                                    <div key={idx} className="relative pl-8 pb-4">
                                      <div className={`absolute left-5 top-1 h-3 w-3 rounded-full mt-1 ${
                                        status.status === 'completed' ? 'bg-green-500' :
                                        status.status === 'cancelled' ? 'bg-red-500' :
                                        'bg-blue-500'
                                      }`}></div>
                                      <div className="ml-3">
                                        <div className="flex justify-between items-start">
                                          <p className="text-sm font-medium text-gray-900 capitalize">{status.status.replace('_', ' ')}</p>
                                          <p className="text-xs text-gray-500">{new Date(status.createdAt).toLocaleString()}</p>
                                        </div>
                                        {status.notes && <p className="text-sm text-gray-600 mt-1">{status.notes}</p>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No status updates yet</p>
                              )}
                            </div>

                            {report.status !== 'completed' && report.status !== 'cancelled' && (
                              <>
                                <div className="mt-6">
                                  <form onSubmit={handleCreateStatus} className="flex flex-col sm:flex-row items-end gap-3">
                                    <div className="flex-1 w-full">
                                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                                      <select
                                        id="status"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                        required
                                      >
                                        <option value="">Select status</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                      </select>
                                    </div>
                                    <button
                                      type="submit"
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                                    >
                                      Update Status
                                    </button>
                                  </form>
                                </div>

                                <div className="mt-4">
                                  <button
                                    onClick={() => handleCancelReport(report.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel Report
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* New Report Tab */}
            {activeTab === 'new-report' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Report</h2>
                <form onSubmit={handleCreateReport} className="space-y-4 max-w-2xl">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={newReport.title}
                      onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      placeholder="Enter report title"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      id="category"
                      value={newReport.category}
                      onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Problem</option>
                      <option value="service">Service Request</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      rows={4}
                      value={newReport.description}
                      onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      placeholder="Describe your issue in detail"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Submit Report
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reports')}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}