import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  FileText, 
  Bell, 
  Shield
} from 'lucide-react';

export const AboutService = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Layanan Terpercaya
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Apa Itu Sistem Monitoring Air PDAM?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform digital yang membantu masyarakat memantau kondisi dan kualitas air bersih secara mudah, transparan, dan real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Status Sistem</h3>
                <p className="text-gray-600">Informasi real-time tentang kondisi operasional sistem PDAM di wilayah Anda</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Informasi Gangguan</h3>
                <p className="text-gray-600">Update langsung jika ada pemeliharaan atau gangguan sistem</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Laporan Gangguan</h3>
                <p className="text-gray-600">Mudah melaporkan masalah langsung dari aplikasi</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 p-3 rounded-full">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Riwayat Aktivitas</h3>
                <p className="text-gray-600">Catatan lengkap tentang semua aktivitas dan perubahan sistem</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl p-8 text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Droplets className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-2">PDAM Smart Monitor</h3>
                <p className="text-blue-100">Sistem Monitoring Terpadu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutService;