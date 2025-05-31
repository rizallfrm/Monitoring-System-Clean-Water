import React, { useState, useEffect } from 'react';
import { 
 
  FileText, 
  
  Users, 
  CheckCircle, 
  
  TrendingUp,
  Clock,
 
} from 'lucide-react';

export const StatisticsSection = () => {
  const [counters, setCounters] = useState({
    users: 0,
    reports: 0,
    completion: 0,
    response: 0
  });

  const stats = [
    { 
      icon: <Users className="w-8 h-8" />, 
      label: "Pengguna Terdaftar", 
      value: 8500, 
      suffix: "orang",
      key: "users",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: <FileText className="w-8 h-8" />, 
      label: "Laporan Bulan Ini", 
      value: 180, 
      suffix: "laporan",
      key: "reports",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: <CheckCircle className="w-8 h-8" />, 
      label: "Tingkat Penyelesaian", 
      value: 97, 
      suffix: "%",
      key: "completion",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: <Clock className="w-8 h-8" />, 
      label: "Waktu Respon Rata-rata", 
      value: 12, 
      suffix: "menit",
      key: "response",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat) => {
              const increment = stat.value / 100;
              let current = 0;
              const timer = setInterval(() => {
                current += increment;
                if (current >= stat.value) {
                  current = stat.value;
                  clearInterval(timer);
                }
                setCounters(prev => ({ ...prev, [stat.key]: Math.floor(current) }));
              }, 20);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('statistics');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="statistics" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Statistik Layanan
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Dipercaya Ribuan Pengguna
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Angka yang menunjukkan kepercayaan dan kepuasan masyarakat terhadap layanan kami
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-500 group-hover:scale-105 border border-white/10">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {counters[stat.key].toLocaleString()}
                  <span className="text-2xl ml-1">{stat.suffix}</span>
                </div>
                <p className="text-gray-300 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Updates Indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Data diperbarui setiap 5 menit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StatisticsSection;