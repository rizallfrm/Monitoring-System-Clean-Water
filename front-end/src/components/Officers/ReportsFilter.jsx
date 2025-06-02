import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const ReportsFilter = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-blue-50/30 to-transparent rounded-full -translate-y-16 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-r from-purple-50/30 to-transparent rounded-full translate-y-12 -translate-x-24"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
            <SlidersHorizontal className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Filter & Pencarian</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan judul, deskripsi, atau pelapor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white placeholder-gray-400"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-md">
                ⌘K
              </kbd>
            </div>
          </div>

        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">Tips:</span> Gunakan kata kunci spesifik untuk hasil pencarian yang lebih akurat
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilter;