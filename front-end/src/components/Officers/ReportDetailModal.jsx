import React from 'react';
import { XCircle, UserCheck, Edit, MapPin, Calendar, User, Flag } from 'lucide-react';

const ReportDetailModal = ({ report, onClose, onAssign }) => {
  if (!report) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-800 border-orange-200',
      onGoing: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200',
      completed: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200',
      cancelled: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-gradient-to-r from-red-500 to-rose-600',
      medium: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      low: 'bg-gradient-to-r from-green-500 to-emerald-500'
    };
    return colors[priority] || 'bg-gradient-to-r from-gray-500 to-slate-600';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-gray-200 animate-in slide-in-from-bottom-4 zoom-in-95 duration-400">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Flag className="h-6 w-6 mr-3" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  {report.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{report.title}</h3>
              <p className="text-blue-100 text-sm">
                Laporan Detail - ID: #{report.id}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200 hover:rotate-90"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Status and Priority Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Status Laporan</p>
              </div>
              <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-sm ${getStatusColor(report.status)}`}>
                {report.status === 'pending' ? 'Menunggu' : 
                 report.status === 'onGoing' ? 'Dikerjakan' :
                 report.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
              </span>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Flag className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Tingkat Prioritas</p>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${getPriorityColor(report.priority)} mr-3 shadow-sm`}></div>
                <span className="text-lg font-bold capitalize text-gray-800">{report.priority}</span>
              </div>
            </div>
          </div>
          
          {/* Description Card */}
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              Deskripsi Lengkap
            </h4>
            <p className="text-gray-700 leading-relaxed text-base bg-white/60 p-4 rounded-xl border border-blue-200">
              {report.description}
            </p>
          </div>
          
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Lokasi Kejadian</p>
              </div>
              <p className="text-gray-800 font-medium text-lg">{report.location}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50/50 to-yellow-50/50 rounded-2xl p-6 border border-orange-100">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Pelapor</p>
              </div>
              <p className="text-gray-800 font-medium text-lg">{report.reporter?.name || report.reporter}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
            {report.status === 'pending' && (
              <button 
                onClick={() => onAssign(report.id)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <UserCheck className="h-5 w-5 mr-2" />
                Ambil Tugas
              </button>
            )}
            <button className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95">
              <Edit className="h-5 w-5 mr-2" />
              Edit Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;