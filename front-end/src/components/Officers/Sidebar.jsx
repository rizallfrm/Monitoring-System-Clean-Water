import React from "react";
import { Home, FileText, CheckCircle, LogOut, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, profile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-white via-gray-50/50 to-white shadow-2xl border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-64 bg-gradient-to-bl from-blue-50/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-40 h-48 bg-gradient-to-tr from-purple-50/40 to-transparent"></div>

      {/* Logo and User Info */}
      <div className="p-6 border-b border-gray-200 relative z-10">
        <div className="flex items-center group">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Activity className="h-7 w-7 text-white relative z-10" />
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Dashboard Petugas
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Kelola laporan & tindakan
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10">
        {[
          {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            gradient: "from-blue-500 to-indigo-600",
          },
          {
            id: "reports",
            label: "Laporan",
            icon: FileText,
            gradient: "from-green-500 to-emerald-600",
          },
          {
            id: "actions",
            label: "Tindakan",
            icon: CheckCircle,
            gradient: "from-purple-500 to-pink-600",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center w-full px-4 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 relative overflow-hidden ${
              activeTab === tab.id
                ? "bg-gradient-to-r text-white shadow-lg transform scale-105 " +
                  tab.gradient
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105"
            }`}
          >
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
            )}
            <div
              className={`p-2 rounded-xl mr-3 transition-all duration-300 relative z-10 ${
                activeTab === tab.id
                  ? "bg-white/20"
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}
            >
              <tab.icon
                className={`h-5 w-5 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              />
            </div>
            <span className="relative z-10">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 relative z-10">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">
                {getInitials(profile?.name)}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {profile?.name || "User"}
                </h3>
                
              </div>
              <p className="text-xs text-gray-500">
                {profile?.role || "Petugas Lapangan"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full mt-3 px-3 py-2 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-red-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;