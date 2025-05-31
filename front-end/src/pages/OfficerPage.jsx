import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, XCircle, Plus, Sparkles, Target, TrendingUp } from 'lucide-react';
import reportService from '../services/reportService';
import actionService from '../services/actionService';
import statusService from '../services/statusService';

// Import components
import Sidebar from '../components/Officers/Sidebar';
import StatCard from '../components/Officers/StatCard';
import ReportCard from '../components/Officers/ReportCard';
import ReportsFilter from '../components/Officers/ReportsFilter';
import ActionModal from '../components/Officers/ActionModal';
import ReportDetailModal from '../components/Officers/ReportDetailModal';

const OfficerPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [actions, setActions] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    onGoing: 0,
    completed: 0,
    cancelled: 0
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [actionForm, setActionForm] = useState({
    reportId: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load reports
        const reportsData = await reportService.getAllReports();
        setReports(reportsData.data?.reports || []);
        
        // Load actions
        const actionsData = await actionService.getAllActions();
        setActions(actionsData.data?.actions || []);
        
        // Load statistics
        const statsData = await statusService.getStatusStatistics();
        setStats({
          pending: statsData.pending || 0,
          onGoing: statsData.onGoing || 0,
          completed: statsData.completed || 0,
          cancelled: statsData.cancelled || 0
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle create new action
  const handleCreateAction = async () => {
    try {
      await actionService.createAction({
        reportId: actionForm.reportId,
        description: actionForm.description,
        assignedTo: actionForm.assignedTo,
        dueDate: actionForm.dueDate,
        status: 'planned'
      });
      
      // Refresh actions list
      const updatedActions = await actionService.getAllActions();
      setActions(updatedActions.data?.actions || []);
      setShowActionModal(false);
    } catch (error) {
      console.error('Error creating action:', error);
    }
  };

  // Handle assign report to officer
  const handleAssignReport = async (reportId) => {
    try {
      const officerId = 'current-officer-id';
      await reportService.assignOfficer(reportId, { officerId });
      
      // Refresh reports list
      const updatedReports = await reportService.getAllReports();
      setReports(updatedReports.data?.reports || []);
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  // Handle action form change
  const handleActionFormChange = (field, value) => {
    setActionForm({
      ...actionForm,
      [field]: value
    });
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Status and priority color helpers
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      onGoing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 font-medium">Memuat data...</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
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
                              <h2 className="text-xl font-bold text-gray-900">Laporan Terbaru</h2>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                              {reports.length} Total
                            </span>
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
                                      <div className={`w-4 h-4 rounded-full ${getPriorityColor(report.priority)} shadow-sm`}></div>
                                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                                        {index + 1}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">{report.title}</p>
                                      <p className="text-sm text-gray-500 flex items-center">
                                        📍 {report.location}
                                      </p>
                                    </div>
                                  </div>
                                  <span className={`px-4 py-2 rounded-xl text-xs font-medium border shadow-sm ${getStatusColor(report.status)}`}>
                                    {report.status === 'pending' ? 'Menunggu' : 
                                    report.status === 'onGoing' ? 'Dikerjakan' :
                                    report.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
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

                {activeTab === 'reports' && (
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
                      {filteredReports.map(report => (
                        <div key={report.id} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <ReportCard 
                            report={report}
                            onView={setSelectedReport}
                            onAssign={handleAssignReport}
                            onAddAction={(report) => {
                              setActionForm({ ...actionForm, reportId: report.id });
                              setShowActionModal(true);
                            }}
                            getStatusColor={getStatusColor}
                            getPriorityColor={getPriorityColor}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-blue-600/5 rounded-2xl"></div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 relative">
                        <div className="p-6 border-b border-gray-100/50 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Daftar Tindakan</h2>
                          </div>
                          <button 
                            onClick={() => setShowActionModal(true)}
                            className="group relative flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                            <Plus className="h-4 w-4 mr-2 relative z-10" />
                            <span className="relative z-10 font-medium">Tambah Tindakan</span>
                          </button>
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
                                      <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{action.description}</h3>
                                        <p className="text-sm text-gray-600 mt-1">👤 Ditugaskan ke: <span className="font-medium">{action.assignedTo}</span></p>
                                      </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-xl text-xs font-medium shadow-sm ${
                                      action.status === 'planned' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                      action.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                      'bg-green-100 text-green-800 border border-green-200'
                                    }`}>
                                      {action.status === 'planned' ? '📋 Direncanakan' :
                                      action.status === 'in_progress' ? '⚡ Sedang Dikerjakan' : '✅ Selesai'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 flex items-center">
                                      🗓️ Tenggat: <span className="font-medium ml-1">{new Date(action.dueDate).toLocaleDateString()}</span>
                                    </span>
                                    <div className="flex space-x-3">
                                      <button className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">
                                        ✏️ Edit
                                      </button>
                                      <button className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium">
                                        🗑️ Hapus
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
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
          />

          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onAssign={handleAssignReport}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
        </div>
      </div>
    </div>
  );
};

export default OfficerPage;