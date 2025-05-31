import React from 'react';
import { Users, Clock, Eye, UserCheck, Plus, MapPin } from 'lucide-react';

const ReportCard = ({ report, onView, onAssign, onAddAction }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-gradient-to-r from-red-500 to-red-600',
      medium: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      low: 'bg-gradient-to-r from-green-500 to-emerald-500'
    };
    return colors[priority] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-800 border-orange-200 shadow-orange-100',
      onGoing: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200 shadow-blue-100',
      completed: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200 shadow-emerald-100',
      cancelled: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-red-100'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200 shadow-gray-100';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
      medium: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      low: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
    };
    return badges[priority] || 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-50 to-pink-50 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${getPriorityColor(report.priority)} mr-3 shadow-sm`}></div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(report.priority)}`}>
                  {report.priority.toUpperCase()}
                </span>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 shadow-sm ${getStatusColor(report.status)}`}>
                {report.status === 'pending' ? 'Menunggu' : 
                 report.status === 'onGoing' ? 'Dikerjakan' :
                 report.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {report.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {report.description}
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-700">Pelapor</p>
                  <p>{report.reporter?.name || report.reporter}</p>
                </div>
              </div>
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                <div>
                  <p className="font-medium text-gray-700">Tanggal</p>
                  <p>{new Date(report.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center bg-gray-50 rounded-lg px-3 py-2">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                <div>
                  <p className="font-medium text-gray-700">Lokasi</p>
                  <p>{report.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          <button 
            onClick={() => onView(report)}
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 text-sm font-medium border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
          >
            <Eye className="h-4 w-4 mr-2" />
            Detail
          </button>
          {report.status === 'pending' && (
            <button 
              onClick={() => onAssign(report.id)}
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 text-sm font-medium border border-green-200 hover:border-green-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Ambil Tugas
            </button>
          )}
          <button 
            onClick={() => onAddAction(report)}
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 text-sm font-medium border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4 mr-2" />
            Aksi
          </button>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ReportCard;