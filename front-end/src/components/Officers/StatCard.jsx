import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color, trend, reports, trendDirection = 'up' }) => {
  const getGradientColors = (color) => {
    const gradients = {
      'text-blue-600': 'from-blue-500 to-indigo-600',
      'text-green-600': 'from-green-500 to-emerald-600',
      'text-purple-600': 'from-purple-500 to-pink-600',
      'text-orange-600': 'from-orange-500 to-red-500',
      'text-red-600': 'from-red-500 to-rose-600',
      'text-indigo-600': 'from-indigo-500 to-blue-600'
    };
    return gradients[color] || 'from-gray-500 to-gray-600';
  };

  const getBackgroundColors = (color) => {
    const backgrounds = {
      'text-blue-600': 'from-blue-50 to-indigo-50',
      'text-green-600': 'from-green-50 to-emerald-50',
      'text-purple-600': 'from-purple-50 to-pink-50',
      'text-orange-600': 'from-orange-50 to-red-50',
      'text-red-600': 'from-red-50 to-rose-50',
      'text-indigo-600': 'from-indigo-50 to-blue-50'
    };
    return backgrounds[color] || 'from-gray-50 to-gray-100';
  };

  const getIconBackgroundColors = (color) => {
    const backgrounds = {
      'text-blue-600': 'from-blue-100 to-indigo-100',
      'text-green-600': 'from-green-100 to-emerald-100',
      'text-purple-600': 'from-purple-100 to-pink-100',
      'text-orange-600': 'from-orange-100 to-red-100',
      'text-red-600': 'from-red-100 to-rose-100',
      'text-indigo-600': 'from-indigo-100 to-blue-100'
    };
    return backgrounds[color] || 'from-gray-100 to-gray-200';
  };

  return (
    <div className={`group bg-gradient-to-br ${getBackgroundColors(color)} rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative`}>
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${getGradientColors(color)} bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300`}>
            {value}
          </p>
          {trend && (
            <div className={`flex items-center space-x-2 ${
              trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trendDirection === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-semibold">{trend}</span>
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${getIconBackgroundColors(color)} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-white/50`}>
          <Icon className={`h-8 w-8 ${color} group-hover:scale-110 transition-transform duration-300`} />
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Pulse effect for active state */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getGradientColors(color)} opacity-5 animate-pulse`}></div>
      </div>
    </div>
  );
};

export default StatCard;