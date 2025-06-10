import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const ReportsFilter = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-blue-50/30 to-transparent rounded-full -translate-y-16 translate-x-32 hidden sm:block"></div>
      <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-r from-purple-50/30 to-transparent rounded-full translate-y-12 -translate-x-24 hidden sm:block"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-lg mr-2 sm:mr-3">
            <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Filter & Pencarian</h3>
        </div>
        
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 sm:border-2 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white placeholder-gray-400 text-sm sm:text-base"
            />
            <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
              <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-md hidden sm:inline-flex">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Status Filter - Example for mobile */}
          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
            {['Semua', 'Diterima', 'Diproses', 'Selesai'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status === 'Semua' ? '' : status)}
                className={`px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl border transition-colors ${
                  filterStatus === (status === 'Semua' ? '' : status)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-medium sm:font-semibold text-gray-900">Tips:</span> Gunakan kata kunci spesifik
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilter;