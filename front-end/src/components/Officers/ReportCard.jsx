import { Users, Clock, Eye, UserCheck, Plus } from 'lucide-react';

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

export const ReportCard = ({ report, onViewDetail, onTakeAction }) => {
  return (
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
                {new Date(report.createdAt).toLocaleDateString()}
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
            onClick={() => onViewDetail(report)}
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
            onClick={() => onTakeAction()}
            className="flex items-center px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Aksi
          </button>
        </div>
      </div>
    </div>
  );
};
