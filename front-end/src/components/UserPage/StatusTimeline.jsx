import React from 'react';

const StatusTimeline = ({ statusHistory }) => {
  if (!statusHistory || statusHistory.length === 0) {
    return <p className="text-sm text-gray-500">No status history available</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {statusHistory.map((status, index) => (
          <li key={index}>
            <div className="relative pb-8">
              {index !== statusHistory.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                    status.status === 'pending' ? 'bg-yellow-400' :
                    status.status === 'in_progress' ? 'bg-blue-400' :
                    status.status === 'resolved' ? 'bg-green-400' :
                    status.status === 'cancelled' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`}>
                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500 capitalize">
                      {status.status.replace('_', ' ')} - {status.note || 'No additional notes'}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={status.createdAt}>
                      {new Date(status.createdAt).toLocaleString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusTimeline;