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

      
    </div>
  );
};
export default StatisticsSection;