import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  FileText,
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
} from "lucide-react";
import statusService from "../../services/statusService";
import reportService from "../../services/reportService";
import userService from "../../services/userService";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statusStats, reports, users] = await Promise.all([
          statusService.getStatusStatistics(),
          reportService.getAllReports().catch((e) => {
            console.error("Error mengambil laporan:", e);
            return [];
          }),
          userService.getAllUsers().catch((e) => {
            console.error("Error mengambil pengguna:", e);
            return [];
          }),
        ]);


        const officerCount = users.filter(
          (user) => user.role === "Petugas"
        ).length;
        const userCount = users.filter((user) => user.role === "Warga").length;
        const totalUsers = users.length; // Tambahkan ini untuk total semua pengguna

        setStats({
          ...statusStats,
          officerCount,
          userCount,
          totalUsers,
          reportCount: reports.length,
        });
      } catch (err) {
        console.error("Error saat mengambil data dashboard:", {
          error: err,
          stack: err.stack,
        });
        setError(err.message || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1 text-xs text-white/90">
              <TrendingUp className="h-3 w-3" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className="rounded-full bg-white/20 p-3">
          <Icon className="h-8 w-8" />
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
    </div>
  );

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
            <p className="mt-1 text-sm text-red-600">
              Silakan coba refresh halaman atau hubungi administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const barData = [
    { name: "Pending", value: stats?.pending || 0 },
    { name: "Sedang Proses", value: stats?.onGoing || 0 },
    { name: "Selesai", value: stats?.completed || 0 },
    { name: "Dibatalkan", value: stats?.cancelled || 0 },
  ];

  const pieData = [
    { name: "Pending", value: stats?.pending || 0 },
    { name: "Sedang Proses", value: stats?.onGoing || 0 },
    { name: "Selesai", value: stats?.completed || 0 },
    { name: "Dibatalkan", value: stats?.cancelled || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-gray-600">
              Sistem Monitoring Air Bersih PDAM
            </p>
          </div>
          <div className="flex items-center space-x-2 rounded-full bg-blue-100 px-4 py-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Live Monitoring
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Laporan"
            value={stats?.reportCount || 0}
            icon={FileText}
            color="from-blue-500 to-blue-600"
            trend="Semua Laporan"
          />
          <StatCard
            title="Selesai"
            value={stats?.completed || 0}
            icon={CheckCircle}
            color="from-green-500 to-green-600"
            trend="Laporan sudah selesai"
          />
          <StatCard
            title="Petugas"
            value={stats?.officerCount || 0}
            icon={Wrench}
            color="from-purple-500 to-purple-600"
            trend="Aktif"
          />
          <StatCard
            title="Warga"
            value={stats?.userCount || 0}
            icon={Users}
            color="from-orange-500 to-orange-600"
            trend="Aktif"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Bar Chart */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Status Laporan Overview
                </h3>
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1E40AF" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div>
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-xl font-semibold text-gray-900">
                Distribusi Status
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      ></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default DashboardPage;
