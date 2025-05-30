import React from 'react';
import StatusTimeline from './StatusTimeline';

const ReportDetail = ({ report, statusHistory, onClose, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                <p className="mt-2 text-gray-600">{report.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className={`mt-1 text-sm ${
                    report.status === 'pending' ? 'text-yellow-600' :
                    report.status === 'in_progress' ? 'text-blue-600' :
                    report.status === 'resolved' ? 'text-green-600' :
                    report.status === 'cancelled' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {report.status.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(report.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Priority</h4>
                  <p className="mt-1 text-sm text-gray-600 capitalize">
                    {report.priority || 'normal'}
                  </p>
                </div>
              </div>

              {report.images && report.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Attachments</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {report.images.map((image, index) => (
                      <div key={index} className="border rounded-md overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Report attachment ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Status History</h4>
                <StatusTimeline statusHistory={statusHistory} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;