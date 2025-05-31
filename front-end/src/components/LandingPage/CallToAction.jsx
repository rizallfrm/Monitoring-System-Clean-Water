"use client";
import {


  Users,

  Shield,
  Zap,
  ChevronRight
} from 'lucide-react';

export const CallToAction = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Bergabung Sekarang
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ingin Selalu Update Kondisi Air Bersih di Wilayah Anda?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Dapatkan akses penuh ke sistem monitoring air PDAM dan nikmati kemudahan informasi real-time
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Daftar Sekarang
          </button>
          <button className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
            Masuk ke Akun
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Benefits */}
        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <Users className="w-8 h-8 mx-auto mb-3 text-blue-200" />
            <h3 className="font-semibold mb-2">Komunitas Aktif</h3>
            <p className="text-sm text-blue-100">Bergabung dengan pengguna lainnya</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <Shield className="w-8 h-8 mx-auto mb-3 text-green-200" />
            <h3 className="font-semibold mb-2">Data Terpercaya</h3>
            <p className="text-sm text-blue-100">Informasi langsung dari PDAM</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-200" />
            <h3 className="font-semibold mb-2">Akses Cepat</h3>
            <p className="text-sm text-blue-100">Interface mudah dan responsif</p>
          </div>
        </div>
      </div>
    </div>
  );
};



export default CallToAction;