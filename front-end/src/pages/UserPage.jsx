"use client";
import { useAuth } from "../Context/authContext";
import { useEffect, useState } from "react";
import Frame from "../components/UserPage/Frame";
import ProfileSection from "../components/UserPage/ProfileSection";
import ReportList from "../components/UserPage/ReportList";
import ReportForm from "../components/UserPage/ReportForm";
import authService from "../services/authService";
import reportService from "../services/reportService";
import { Droplets, FileText, Plus, AlertCircle, Activity, RefreshCw } from "lucide-react";

export default function UserPage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  });

  const calculateStats = (reportsData) => {
    if (!Array.isArray(reportsData)) {
      return { total: 0, pending: 0, resolved: 0, inProgress: 0 };
    }

    return {
      total: reportsData.length,
      pending: reportsData.filter(r => r.status === 'pending').length,
      resolved: reportsData.filter(r => r.status === 'resolved').length,
      inProgress: reportsData.filter(r => r.status === 'in_progress').length
    };
  };

  const fetchData = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching data... ${isRetry ? '(retry)' : ''}`);
      
      // Fetch profile first
      let profileData = null;
      let reportsData = [];
      
      try {
        profileData = await authService.getProfile();
        console.log("Profile data fetched:", profileData);
      } catch (profileError) {
        console.warn("Failed to fetch profile:", profileError);
        // Continue even if profile fails
      }
      
      // Fetch reports with retry logic
      try {
        reportsData = await reportService.getAllReports();
        console.log("Reports data fetched:", reportsData);
        
        // Ensure it's an array
        if (!Array.isArray(reportsData)) {
          console.warn("Reports data is not an array, converting:", reportsData);
          reportsData = [];
        }
      } catch (reportsError) {
        console.error("Failed to fetch reports:", reportsError);
        
        // If this is the first attempt, try to handle gracefully
        if (!isRetry) {
          reportsData = [];
          console.log("Setting empty reports array as fallback");
        } else {
          throw reportsError; // Re-throw on retry
        }
      }

      // Update state
      setProfile(profileData);
      setReports(reportsData);
      setStats(calculateStats(reportsData));
      setRetryCount(0); // Reset retry count on success
      
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMessage = err.message || "Failed to fetch data";
      setError(errorMessage);
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchData(true);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Loading state for user authentication
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

  // Loading state for data fetching
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-blue-600 font-medium">
            Memuat dashboard... {retryCount > 0 && `(Percobaan ${retryCount + 1})`}
          </p>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-lg max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold">Terjadi Kesalahan</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              {retryCount > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Percobaan ke-{retryCount + 1}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <Frame>
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Droplets className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Monitoring Air PDAM</h1>
                <p className="text-blue-100">Dashboard Pelaporan Kualitas Air</p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Laporan</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Menunggu</p>
                    <p className="text-2xl font-bold text-yellow-300">{stats.pending}</p>
                  </div>
                  <Activity className="h-8 w-8 text-yellow-300" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Proses</p>
                    <p className="text-2xl font-bold text-blue-300">{stats.inProgress}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-300" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Selesai</p>
                    <p className="text-2xl font-bold text-green-300">{stats.resolved}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Profile Section */}
            <div className="xl:w-1/4">
              <ProfileSection profile={profile} />
            </div>

            {/* Main Dashboard */}
            <div className="xl:w-3/4">
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
                          Riwayat Laporan Air PDAM
                        </h2>
                        <p className="text-gray-600">
                          Pantau status dan kelola laporan kualitas air Anda
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
                          Sampaikan keluhan atau masalah terkait kualitas air PDAM di area Anda
                        </p>
                      </div>
                      <ReportForm
                        onReportCreated={(newReport) => {
                          const updatedReports = [newReport, ...reports];
                          setReports(updatedReports);
                          setActiveTab("reports");
                          setStats(calculateStats(updatedReports));
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}