"use client";
import React, { useState} from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  FileText, 
  Bell, 
  BarChart3, 
  CheckCircle, 
  Zap
 
} from 'lucide-react';


export const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Sistem Monitoring Terpadu",
      description: "Pantau kondisi sistem air secara menyeluruh dengan teknologi modern",
      color: "from-blue-500 to-cyan-500",
      details: ["Monitoring real-time", "Update otomatis", "Dashboard interaktif"]
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Informasi Gangguan",
      description: "Update real-time jika ada pemeliharaan atau gangguan sistem air",
      color: "from-orange-500 to-red-500",
      details: ["Info gangguan", "Info pemeliharaan", "Status progress"]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Laporan Pengaduan",
      description: "Pengguna dapat melaporkan masalah air secara langsung dan cepat",
      color: "from-green-500 to-emerald-500",
      details: ["Form mudah digunakan", "Upload foto bukti", "Tracking status"]
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Informasi Terkini",
      description: "Dapatkan informasi terbaru saat ada perubahan status sistem",
      color: "from-purple-500 to-pink-500",
      details: ["Info terbaru", "Update status", "Berita layanan"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Riwayat Laporan",
      description: "Pantau status laporan dan tindak lanjutnya dengan detail lengkap",
      color: "from-indigo-500 to-blue-500",
      details: ["History lengkap", "Status tracking", "Detail laporan"]
    }
  ];

  return (
    <div className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Fitur Unggulan
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Platform Terdepan untuk Monitoring Air
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Teknologi modern yang memudahkan akses informasi air bersih untuk seluruh masyarakat
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-gradient-to-r ' + feature.color + ' shadow-2xl scale-105'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    activeFeature === index ? 'bg-white/20' : 'bg-gray-700'
                  }`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-200 mb-3">{feature.description}</p>
                    {activeFeature === index && (
                      <div className="space-y-2 animate-fadeIn">
                        {feature.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-300" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
};

export default Features;