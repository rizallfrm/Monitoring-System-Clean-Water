import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, TrendingUp, CheckCircle, Clock, AlertCircle, XCircle,
  Eye, Edit, UserCheck, Plus, Search, Filter, Bell, Settings, LogOut, 
  Home, Activity 
} from 'lucide-react';
import { StatCards } from '../components/officer/StatCards';
import { ReportCard } from '../components/officer/ReportCard';
import { ActionModal } from '../components/officer/ActionModal';
import reportService from '../services/reportService';
import actionService from '../services/actionService';
import statusService from '../services/statusService';

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

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch reports
      const reportsResponse = await reportService.getAllReports();
      setReports(reportsResponse);
      
      // Fetch actions
      const actionsResponse = await actionService.getAllActions();
      setActions(actionsResponse);
      
      // Fetch statistics
      const statsResponse = await statusService.getStatusStatistics();
      setStats({
        pending: statsResponse.pending,
        onGoing: statsResponse.onGoing,
        completed: statsResponse.completed,
        cancelled: statsResponse.cancelled
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAction = async (actionData) => {
    try {
      await actionService.createAction(actionData);
      // Refresh actions list
      const updatedActions = await actionService.getAllActions();
      setActions(updatedActions);
    } catch (error) {
      console.error('Error creating action:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header and Navigation (same as before) */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Memuat data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <StatCards stats={stats} />
                
                {/* Recent Reports */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Laporan Terbaru</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {reports.slice(0, 3).map(report => (
                        <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(report.priority)} mr-3`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{report.title}</p>
                              <p className="text-sm text-gray-500">{report.location}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                            {report.status === 'pending' ? 'Menunggu' : 
                             report.status === 'onGoing' ? 'Dikerjakan' :
                             report.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Cari laporan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-5 w-5 text-gray-400" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="onGoing">Dikerjakan</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredReports.map(report => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                      onViewDetail={setSelectedReport}
                      onTakeAction={() => setShowActionModal(true)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Daftar Tindakan</h2>
                    <button 
                      onClick={() => setShowActionModal(true)}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Tindakan
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {actions.map(action => (
                        <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">{action.description}</h3>
                              <p className="text-sm text-gray-500">Ditugaskan ke: {action.assignedTo}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              action.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                              action.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {action.status === 'planned' ? 'Direncanakan' :
                               action.status === 'in_progress' ? 'Sedang Dikerjakan' : 'Selesai'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Tenggat: {new Date(action.dueDate).toLocaleDateString()}</span>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">Edit</button>
                              <button className="text-red-600 hover:text-red-800">Hapus</button>
                            </div>
                          </div>
                        </div>
                      ))}
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
        reports={reports}
        onSubmit={handleCreateAction}
      />

      {/* Report Detail Modal (same as before) */}
    </div>
  );
};

export default OfficerPage;