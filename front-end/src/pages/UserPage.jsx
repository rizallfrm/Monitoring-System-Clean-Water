"use client";
import { useAuth } from "../Context/authContext";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ReportList from "../components/UserPage/ReportList";
import ReportForm from "../components/UserPage/ReportForm";
import authService from "../services/authService";
import reportService from "../services/reportService";
import { Droplets, FileText, Plus, AlertCircle, Activity } from "lucide-react";
import Footer from "../components/LandingPage/Footer";

export default function UserPage() {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reportsData = await reportService.getAllReports();

        setReports(reportsData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-blue-600 font-medium">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-blue-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-lg max-w-md">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="font-semibold">Terjadi Kesalahan</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar yang diperbesar */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-12 shadow-lg">
        <Navbar />
        <div className="max-w-7xl mx-auto mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Droplets className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Monitoring Sistem PDAM</h1>
              <p className="text-blue-100 text-lg">Dashboard Pelaporan </p>
            </div>
          </div>
          
          {/* Menu Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <FileText className="h-7 w-7 text-blue-200 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-base mb-2">Menu Laporan Saya</p>
                  <p className="text-blue-100 text-sm leading-relaxed">Untuk melihat riwayat dan mengelola laporan yang sudah dibuat</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <Plus className="h-7 w-7 text-green-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-base mb-2">Menu Buat Laporan</p>
                  <p className="text-blue-100 text-sm leading-relaxed">Untuk membuat laporan baru terkait masalah kualitas air</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <Activity className="h-7 w-7 text-purple-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-base mb-2">Menu Profil</p>
                  <p className="text-blue-100 text-sm leading-relaxed">Untuk mengelola informasi akun dan data pribadi Anda</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <Droplets className="h-7 w-7 text-cyan-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-base mb-2">Menu Dashboard</p>
                  <p className="text-blue-100 text-sm leading-relaxed">Untuk melihat overview sistem dan navigasi utama</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            {/* Navigation Tabs */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <div className="flex">
                <button
                  className={`flex items-center space-x-2 py-4 px-6 font-semibold transition-all duration-200 ${
                    activeTab === "reports"
                      ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTab("reports")}
                >
                  <FileText className="h-5 w-5" />
                  <span>Laporan Saya</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {reports.length}
                  </span>
                </button>
                <button
                  className={`flex items-center space-x-2 py-4 px-6 font-semibold transition-all duration-200 ${
                    activeTab === "new"
                      ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTab("new")}
                >
                  <Plus className="h-5 w-5" />
                  <span>Buat Laporan</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8">
              {activeTab === "reports" ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Riwayat Laporan
                    </h2>
                    <p className="text-gray-600">
                      Pantau status dan kelola laporan Anda
                    </p>
                  </div>
                  <ReportList reports={reports} />
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Laporkan Masalah Air PDAM
                    </h2>
                    <p className="text-gray-600">
                      Sampaikan keluhan atau masalah terkait layanan PDAM di area Anda
                    </p>
                  </div>
                  <ReportForm
                    onReportCreated={(newReport) => {
                      setReports([newReport, ...reports]);
                      setActiveTab("reports");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}