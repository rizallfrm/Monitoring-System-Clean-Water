import React, { useState, useEffect } from 'react';
import {Users, FileText, TrendingUp, CheckCircle, Clock, AlertCircle, XCircle,Eye,Edit,UserCheck,Plus,Search,Filter,Bell,Settings,LogOut,Home,Activity} from 'lucide-react';

const OfficerPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [actions, setActions] = useState([]);
  const [stats, setStats] = useState({
    pending: 12,
    onGoing: 8,
    completed: 45,
    cancelled: 3
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data untuk demonstrasi
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        title: 'Kerusakan Jalan Raya Utama',
        description: 'Jalan berlubang besar di depan pasar',
        status: 'pending',
        priority: 'high',
        location: 'Jl. Raya Utama No. 123',
        reporter: 'Ahmad Suharto',
        date: '2025-05-30',
        category: 'Infrastruktur'
      },
      {
        id: 2,
        title: 'Lampu Jalan Mati',
        description: 'Lampu penerangan jalan tidak menyala',
        status: 'onGoing',
        priority: 'medium',
        location: 'Jl. Melati No. 45',
        reporter: 'Siti Aminah',
        date: '2025-05-29',
        category: 'Utilitas'
      },
      {
        id: 3,
        title: 'Sampah Menumpuk',
        description: 'Tumpukan sampah tidak diangkut selama 3 hari',
        status: 'completed',
        priority: 'medium',
        location: 'Jl. Mawar No. 78',
        reporter: 'Budi Santoso',
        date: '2025-05-28',
        category: 'Kebersihan'
      }
    ];
    
    const mockActions = [
      {
        id: 1,
        reportId: 1,
        type: 'investigation',
        description: 'Tim survei akan melakukan peninjauan lokasi',
        status: 'planned',
        assignedTo: 'Tim Infrastruktur',
        dueDate: '2025-06-01'
      },
      {
        id: 2,
        reportId: 2,
        type: 'repair',
        description: 'Penggantian lampu dan perbaikan instalasi',
        status: 'in_progress',
        assignedTo: 'Tim Listrik',
        dueDate: '2025-05-31'
      }
    ];

    setReports(mockReports);
    setActions(mockActions);
  }, []);

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

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ReportCard = ({ report }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(report.priority)} mr-3`}></div>
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">{report.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {report.reporter}
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {report.date}
              </span>
              <span>{report.location}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
            {report.status === 'pending' ? 'Menunggu' : 
             report.status === 'onGoing' ? 'Dikerjakan' :
             report.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedReport(report)}
            className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </button>
          {report.status === 'pending' && (
            <button className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm">
              <UserCheck className="h-4 w-4 mr-1" />
              Ambil Tugas
            </button>
          )}
          <button 
            onClick={() => setShowActionModal(true)}
            className="flex items-center px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Aksi
          </button>
        </div>
      </div>
    </div>
  );

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Dashboard Petugas</h1>
                <p className="text-sm text-gray-500">Kelola laporan dan tindakan</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JP</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Joko Purnomo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'reports', label: 'Laporan', icon: FileText },
              { id: 'actions', label: 'Tindakan', icon: CheckCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Clock}
                title="Menunggu"
                value={stats.pending}
                color="text-yellow-600"
                trend="+2 hari ini"
              />
              <StatCard
                icon={Activity}
                title="Dikerjakan"
                value={stats.onGoing}
                color="text-blue-600"
                trend="+3 hari ini"
              />
              <StatCard
                icon={CheckCircle}
                title="Selesai"
                value={stats.completed}
                color="text-green-600"
                trend="+5 hari ini"
              />
              <StatCard
                icon={XCircle}
                title="Dibatalkan"
                value={stats.cancelled}
                color="text-red-600"
              />
            </div>

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
                <ReportCard key={report.id} report={report} />
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
                        <span>Tenggat: {action.dueDate}</span>
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
      </main>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Tambah Tindakan Baru</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Laporan</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  {reports.map(report => (
                    <option key={report.id} value={report.id}>{report.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Tindakan</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Jelaskan tindakan yang akan dilakukan..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ditugaskan ke</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama tim atau petugas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenggat Waktu</label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedReport.title}</h3>
                  <p className="text-gray-500 mt-1">{selectedReport.category}</p>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedReport.status)} mt-1`}>
                    {selectedReport.status === 'pending' ? 'Menunggu' : 
                     selectedReport.status === 'onGoing' ? 'Dikerjakan' :
                     selectedReport.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Prioritas</p>
                  <div className="flex items-center mt-1">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedReport.priority)} mr-2`}></div>
                    <span className="text-sm capitalize">{selectedReport.priority}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Deskripsi</p>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Lokasi</p>
                  <p className="text-gray-600">{selectedReport.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Pelapor</p>
                  <p className="text-gray-600">{selectedReport.reporter}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {selectedReport.status === 'pending' && (
                  <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Ambil Tugas
                  </button>
                )}
                <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerPage;